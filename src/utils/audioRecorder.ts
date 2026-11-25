export type RecorderErrorCode =
  | 'unsupported'
  | 'permission_denied'
  | 'not_found'
  | 'unknown';

export interface ActiveRecordingHandle {
  stop: () => void;
  dispose: () => void;
}

export function isMicrophoneRecordingSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    Boolean(navigator.mediaDevices?.getUserMedia) &&
    typeof MediaRecorder !== 'undefined'
  );
}

export function mapRecorderError(error: unknown): RecorderErrorCode {
  if (!isMicrophoneRecordingSupported()) return 'unsupported';
  if (error instanceof DOMException) {
    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      return 'permission_denied';
    }
    if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
      return 'not_found';
    }
  }
  return 'unknown';
}

function chooseSupportedMimeType(): string | undefined {
  if (typeof MediaRecorder === 'undefined' || typeof MediaRecorder.isTypeSupported !== 'function') {
    return undefined;
  }
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/ogg;codecs=opus',
  ];
  return candidates.find((type) => MediaRecorder.isTypeSupported(type));
}

export function stopMediaStreamTracks(stream: MediaStream | null | undefined): void {
  if (!stream) return;
  try {
    stream.getTracks().forEach((track) => {
      try {
        track.stop();
      } catch {
        // Ignore already-stopped track errors
      }
    });
  } catch {
    // Ignore track iteration errors
  }
}

/**
 * Starts a transient in-memory MediaRecorder session ONLY after explicit user gesture.
 * Stops all microphone tracks immediately when recording stops or disposes.
 * Never persists raw audio to localStorage or external servers.
 */
export async function startTransientMicRecording(callbacks: {
  onRecordingStarted: () => void;
  onAudioReady: (objectUrl: string) => void;
  onError: (code: RecorderErrorCode) => void;
}): Promise<ActiveRecordingHandle | null> {
  if (!isMicrophoneRecordingSupported()) {
    callbacks.onError('unsupported');
    return null;
  }

  let stream: MediaStream | null = null;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch (err) {
    callbacks.onError(mapRecorderError(err));
    return null;
  }

  let recorder: MediaRecorder;
  try {
    const mimeType = chooseSupportedMimeType();
    recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
  } catch {
    stopMediaStreamTracks(stream);
    callbacks.onError('unsupported');
    return null;
  }

  const chunks: BlobPart[] = [];
  let disposed = false;

  recorder.ondataavailable = (event: BlobEvent) => {
    if (event.data && event.data.size > 0) {
      chunks.push(event.data);
    }
  };

  recorder.onerror = () => {
    stopMediaStreamTracks(stream);
    if (!disposed) {
      callbacks.onError('unknown');
    }
  };

  recorder.onstop = () => {
    stopMediaStreamTracks(stream);
    if (disposed) return;
    if (chunks.length === 0) {
      callbacks.onError('unknown');
      return;
    }
    try {
      const blob = new Blob(chunks, {
        type: recorder.mimeType || 'audio/webm',
      });
      const objectUrl = URL.createObjectURL(blob);
      callbacks.onAudioReady(objectUrl);
    } catch {
      callbacks.onError('unknown');
    }
  };

  try {
    recorder.start();
    callbacks.onRecordingStarted();
  } catch {
    stopMediaStreamTracks(stream);
    callbacks.onError('unknown');
    return null;
  }

  return {
    stop: () => {
      if (recorder.state !== 'inactive') {
        try {
          recorder.stop();
        } catch {
          stopMediaStreamTracks(stream);
        }
      } else {
        stopMediaStreamTracks(stream);
      }
    },
    dispose: () => {
      disposed = true;
      if (recorder.state !== 'inactive') {
        try {
          recorder.stop();
        } catch {
          // ignore
        }
      }
      stopMediaStreamTracks(stream);
    },
  };
}
