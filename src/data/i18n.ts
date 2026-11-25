import type { AppLanguage } from '../types/game';

export const GAME_COPY: Record<
  AppLanguage,
  {
    brandName: string;
    tagline: string;
    playButton: string;
    continueButton: string;
    settingsButton: string;
    closeSettings: string;
    enterWorldButton: string;
    backToMap: string;
    backToTitle: string;
    openPassport: string;
    settingsTitle: string;
    appearanceLabel: string;
    modeDay: string;
    modeNight: string;
    modeAuto: string;
    musicLabel: string;
    sfxLabel: string;
    onLabel: string;
    offLabel: string;
    tapToPlay: string;
    languageLabel: string;
    motionLabel: string;
    motionReduced: string;
    motionStandard: string;
    viewModeLabel: string;
    view3D: string;
    view2D: string;
    worldMapPrompt: string;
    dragHint: string;
    webglFallbackNotice: string;
    xpLabel: string;
    coinsLabel: string;
    gemsLabel: string;
    stampsLabel: string;
    comingSoonLabel: string;
    lockedLabel: string;
    missionStagesTitle: string;
    finalChallengeLabel: string;
    passportTitle: string;
    passportEmptyHint: string;
    resetProgress: string;
    resetDone: string;
    avatarTitle: string;
    avatarComingSoon: string;
    continueToWorldMap: string;
    speakHint: string;
    avatarStudioTitle: string;
    explorerNameLabel: string;
    explorerNamePlaceholder: string;
    backButton: string;
    randomizeButton: string;
    waveButton: string;
    confirmExplorerButton: string;
    tabBodySkin: string;
    tabHair: string;
    tabOutfit: string;
    tabBackpack: string;
    baseModelLabel: string;
    skinToneLabel: string;
    hairStyleLabel: string;
    hairColorLabel: string;
    travelOutfitLabel: string;
    outfitColorLabel: string;
    backpackColorLabel: string;
    rotateAvatarHint: string;
    passportIntroTitle: string;
    passportIntroMessage: string;
    enterWorldMapButton: string;
    editExplorerButton: string;
    // Phase 1B: Walkable India (Jaipur)
    arrivingJaipurTitle: string;
    arrivingJaipurSubtitle: string;
    jaipurLandmarksLabel: string;
    jaipurMoveHint: string;
    jaipurCameraHint: string;
    jaipurInteractLabel: string;
    jaipurInteractPromptPrefix: string;
    jaipurSpeakWithAarav: string;
    jaipurInspectLandmark: string;
    jaipurExploreCompleteBadge: string;
    jaipurFallbackNotice: string;
    jaipurNextButton: string;
    jaipurListenButton: string;
    jaipurCameraSensitivity: string;
    jaipurSensitivityLow: string;
    jaipurSensitivityMed: string;
    jaipurSensitivityHigh: string;
    jaipurTouchPadShow: string;
    jaipurTouchPadHide: string;
    jaipurBackToJaipur: string;
    jaipurCulturalNoteLabel: string;
    // Phase 1C: Word Detective
    jaipurObjectiveTalkAarav: string;
    jaipurObjectiveFindObjects: string;
    jaipurObjectiveCompleted: string;
    jaipurObjectsFoundLabel: string;
    jaipurPauseMenuTitle: string;
    jaipurResumeButton: string;
    jaipurWordFoundBadge: string;
    jaipurWordAlreadyFoundBadge: string;
    jaipurStartExploringButton: string;
    jaipurCelebrationTitle: string;
    jaipurCelebrationSubtitle: string;
    jaipurFallback2dObjectiveNotice: string;
    jaipurBuildUnlockedNoticeTitle: string;
    jaipurBuildUnlockedNoticeBody: string;
    jaipurObjectiveTalkAaravBuild: string;
    jaipurObjectivePracticeUnlocked: string;
    jaipurStartSentenceTrainButton: string;
    jaipurReplaySentenceTrainButton: string;
    sentenceTrainTitle: string;
    sentenceTrainCounterLabel: string;
    sentenceTrainTrackHint: string;
    sentenceTrainBankLabel: string;
    sentenceTrainUndoButton: string;
    sentenceTrainResetButton: string;
    sentenceTrainCheckButton: string;
    sentenceTrainNextButton: string;
    sentenceTrainFinishButton: string;
    sentenceTrainSuccessBanner: string;
    sentenceTrainCelebrateTitle: string;
    sentenceTrainCelebrateSubtitle: string;
    sentenceTrainPracticeUnlockedTag: string;
    sentenceTrainReplayNotice: string;
    jaipurPracticeUnlockNoticeTitle: string;
    jaipurPracticeUnlockNoticeBody: string;
    jaipurObjectiveTalkAaravPractice: string;
    jaipurObjectiveSpotAndSpeak: string;
    jaipurObjectivePerformUnlocked: string;
    jaipurStartSpotAndSpeakButton: string;
    jaipurSpeakHerePrompt: string;
    spotSpeakNextSpotPrefix: string;
    spotSpeakProgressLabel: string;
    spotSpeakStepLook: string;
    spotSpeakStepListen: string;
    spotSpeakStepSpeak: string;
    spotSpeakStepReview: string;
    spotSpeakHintsToggleShow: string;
    spotSpeakHintsToggleHide: string;
    spotSpeakModelLabel: string;
    spotSpeakAudioNotice: string;
    spotSpeakStartMicButton: string;
    spotSpeakStopMicButton: string;
    spotSpeakRecordingStatus: string;
    spotSpeakPlaybackButton: string;
    spotSpeakPauseAudioButton: string;
    spotSpeakRetryButton: string;
    spotSpeakMicDeniedNotice: string;
    spotSpeakMicUnavailableNotice: string;
    spotSpeakNoMicToggle: string;
    spotSpeakMicToggle: string;
    spotSpeakNoMicPrompt: string;
    spotSpeakNoMicAloudCheck: string;
    spotSpeakNoMicReadyButton: string;
    spotSpeakSelfReviewHeading: string;
    spotSpeakSelfReviewDisclaimer: string;
    spotSpeakConfidenceGood: string;
    spotSpeakConfidenceRetry: string;
    spotSpeakFeedbackPositiveLabel: string;
    spotSpeakFeedbackTipLabel: string;
    spotSpeakFeedbackNextLabel: string;
    spotSpeakContinueButton: string;
    spotSpeakCelebrateTitle: string;
    spotSpeakCelebrateSubtitle: string;
    spotSpeakAlreadyDoneNote: string;
    // Phase 1F: PERFORM — Final Jaipur Showcase & India Passport Stamp
    jaipurPerformUnlockNoticeTitle: string;
    jaipurPerformUnlockNoticeBody: string;
    jaipurObjectiveTalkAaravPerform: string;
    jaipurObjectiveMissionComplete: string;
    jaipurStartFinalShowcaseButton: string;
    jaipurReplayFinalShowcaseButton: string;
    jaipurReplaySpotAndSpeakButton: string;
    showcaseMissionBadge: string;
    showcaseTitle: string;
    showcaseBriefText: string;
    showcaseTargetDuration: string;
    showcaseStepPrepare: string;
    showcaseStepPerform: string;
    showcaseStepReflect: string;
    showcaseStepCeremony: string;
    showcaseRequirementsHeading: string;
    showcaseModelHeading: string;
    showcaseStartersHeading: string;
    showcaseVocabHeading: string;
    showcaseHideScaffoldButton: string;
    showcaseShowScaffoldButton: string;
    showcaseScaffoldHiddenNote: string;
    showcaseGoPerformButton: string;
    showcaseRecordingHint: string;
    showcaseNoMicHeading: string;
    showcaseNoMicPickThreeLabel: string;
    showcaseNoMicPickedCountLabel: string;
    showcaseNoMicCustomNoteLabel: string;
    showcaseNoMicCustomNotePlaceholder: string;
    showcaseNoMicAloudCheck: string;
    showcaseGoReflectButton: string;
    showcaseReflectHeading: string;
    showcaseReflectChecklistPrompt: string;
    showcaseFinishButton: string;
    showcaseReplayFinishButton: string;
    showcaseCeremonyBadge: string;
    showcaseCeremonyTitle: string;
    showcaseCeremonySubtitle: string;
    showcaseCeremonyReplaySubtitle: string;
    showcaseTotalXpNote: string;
    showcaseViewPassportButton: string;
    showcaseStayJaipurButton: string;
    passportStampIndiaLabel: string;
    passportStampDateLabel: string;
    // Phase 2A: Walkable Kenya (WildSpeak Safari — Maasai Mara)
    arrivingKenyaTitle: string;
    arrivingKenyaSubtitle: string;
    kenyaObjectiveExplore: string;
    kenyaSpotsVisitedLabel: string;
    kenyaSpeakWithAmina: string;
    kenyaInspectSpot: string;
    kenyaBackToMaasaiMara: string;
    kenyaFallback2dNotice: string;
    kenyaWildlifeNoteLabel: string;
    kenyaReadyPreviewBadge: string;
    // Phase 2B: Kenya Stage 1 — Discover the Wild!
    kenyaObjectiveTalkAmina: string;
    kenyaObjectiveDiscover: string;
    kenyaDiscoverCountLabel: string;
    kenyaStartMissionButton: string;
    kenyaOpenFieldGuideButton: string;
    kenyaMeetAminaFirstHint: string;
    kenyaCelebrationTitle: string;
    kenyaCelebrationSubtitle: string;
    kenyaBuildUnlockedBadge: string;
    kenyaBuildSoonNote: string;
    kenyaDiscoveryRecordedBadge: string;
    kenyaHideThaiLabel: string;
    kenyaShowThaiLabel: string;
    kenyaVocabHeading: string;
    kenyaTryAgainFeedback: string;
    kenyaDiscoverCompleteInlineNote: string;
    kenyaDiscoverySavedNote: string;
    kenyaFieldGuideTitle: string;
    kenyaFieldGuideSubtitle: string;
    kenyaEntryCompleteLabel: string;
    kenyaFieldGuideLockedHint: string;
    // Phase 2C: Kenya Stage 2 — BUILD (Safari Fact Builder)
    kenyaObjectiveTalkAminaBuild: string;
    kenyaObjectiveBuild: string;
    kenyaBuildCountLabel: string;
    kenyaStartBuildButton: string;
    kenyaReturnAminaBuildHint: string;
    kenyaBuildCelebrationTitle: string;
    kenyaBuildCelebrationSubtitle: string;
    kenyaPracticeUnlockedBadge: string;
    kenyaPracticeSoonNote: string;
    kenyaBoardStationBadge: string;
    kenyaBuildStepStudyBuild: string;
    kenyaBuildStepSpeak: string;
    kenyaBuildStepSaved: string;
    kenyaBuildLevelA2: string;
    kenyaBuildLevelB1: string;
    kenyaBuildModelLabel: string;
    kenyaBuildShowHint: string;
    kenyaBuildHideHint: string;
    kenyaBuildHintXpSafe: string;
    kenyaBuildClearSlots: string;
    kenyaBuildCheckButton: string;
    kenyaBuildPreviewLabel: string;
    kenyaBuildCheckComplete: string;
    kenyaBuildCheckGrammar: string;
    kenyaBuildCheckFactual: string;
    kenyaBuildGoSpeakButton: string;
    kenyaBuildSpeakHeading: string;
    kenyaBuildSpeakNote: string;
    kenyaBuildSaveButton: string;
    kenyaBuildAlreadySavedNote: string;
    kenyaBuildCompleteInlineNote: string;
    kenyaFieldGuideSentencesHeading: string;
    kenyaFieldGuideSentenceBuiltBadge: string;
    kenyaFieldGuideSentencePending: string;
    kenyaFieldGuideBuiltSummary: string;
    // Phase 2D: Kenya Stage 3 — PRACTICE (WildSpeak Safari Tour)
    kenyaObjectiveTalkAminaPractice: string;
    kenyaObjectivePractice: string;
    kenyaPracticeCountLabel: string;
    kenyaStartPracticeButton: string;
    kenyaReturnAminaPracticeHint: string;
    kenyaPracticeCelebrationTitle: string;
    kenyaPracticeCelebrationSubtitle: string;
    kenyaPerformUnlockedBadge: string;
    kenyaPerformSoonNote: string;
    kenyaPracticeStepListen: string;
    kenyaPracticeStepPrepare: string;
    kenyaPracticeStepSpeak: string;
    kenyaPracticeStepReview: string;
    kenyaPracticeStepDone: string;
    kenyaPracticeModeGuided: string;
    kenyaPracticeModeSupported: string;
    kenyaPracticeModeIndependent: string;
    kenyaPracticeIndependentEncourage: string;
    kenyaPracticeReplayQuestion: string;
    kenyaPracticeQuestionTargetLabel: string;
    kenyaPracticeSavedSentenceLabel: string;
    kenyaPracticeStarterLabel: string;
    kenyaPracticeModelLabel: string;
    kenyaPracticeListenModel: string;
    kenyaPracticeRevealModel: string;
    kenyaPracticeHideModel: string;
    kenyaPracticeHelpShow: string;
    kenyaPracticeHelpHide: string;
    kenyaPracticeHelpXpSafe: string;
    kenyaPracticeSpeakingPromptNote: string;
    kenyaPracticeNoMicAloudCheck: string;
    kenyaPracticeChecklistHeading: string;
    kenyaPracticeChecklistHint: string;
    kenyaPracticeCheckAnswered: string;
    kenyaPracticeCheckFact: string;
    kenyaPracticeCheckClear: string;
    kenyaPracticeCheckConnector: string;
    kenyaPracticeFeedbackHeading: string;
    kenyaPracticeFeedbackHonestBadge: string;
    kenyaPracticeCompleteButton: string;
    kenyaPracticeDoneHeading: string;
    kenyaPracticeAlreadyDoneNote: string;
    kenyaPracticeContinueTour: string;
    // Phase 2E: Kenya Stage 4 — PERFORM (Save the Savanna: Wildlife Ambassador Challenge)
    kenyaObjectiveTalkAminaPerform: string;
    kenyaObjectivePerformReady: string;
    kenyaObjectiveMissionComplete: string;
    kenyaStartFinalChallengeButton: string;
    kenyaReplayFinalChallengeButton: string;
    kenyaReplaySafariTourButton: string;
    kenyaOpenStagePrompt: string;
    kenyaPerformMissionBadge: string;
    kenyaPerformTitle: string;
    kenyaPerformTargetDuration: string;
    kenyaPerformStepBriefing: string;
    kenyaPerformStepPrepare: string;
    kenyaPerformStepSpeech: string;
    kenyaPerformStepQa: string;
    kenyaPerformStepReflect: string;
    kenyaPerformGoalsHeading: string;
    kenyaPerformBriefIntro: string;
    kenyaPerformGoPrepareButton: string;
    kenyaPerformPrepFactsHeading: string;
    kenyaPerformPrepFactsHint: string;
    kenyaPerformPrepReasonsHeading: string;
    kenyaPerformPrepActionsHeading: string;
    kenyaPerformCueCardHeading: string;
    kenyaPerformCustomNoteLabel: string;
    kenyaPerformCustomNotePlaceholder: string;
    kenyaPerformScaffoldShow: string;
    kenyaPerformScaffoldHide: string;
    kenyaPerformScaffoldHiddenNote: string;
    kenyaPerformModelSpeechHeading: string;
    kenyaPerformStartersHeading: string;
    kenyaPerformVocabHeading: string;
    kenyaPerformFromBuildTag: string;
    kenyaPerformStepOntoStageButton: string;
    kenyaPerformStageHint: string;
    kenyaPerformCueCardsToggle: string;
    kenyaPerformHearOpeningButton: string;
    kenyaPerformTimerSuggestedLabel: string;
    kenyaPerformTimerSweetSpotNote: string;
    kenyaPerformNoMicAloudCheck: string;
    kenyaPerformGoQaButton: string;
    kenyaPerformQaHeading: string;
    kenyaPerformQaIntro: string;
    kenyaPerformQaNoMicCheck: string;
    kenyaPerformQaAnsweredBadge: string;
    kenyaPerformGoReflectButton: string;
    kenyaPerformReflectHeading: string;
    kenyaPerformReflectDisclaimer: string;
    kenyaPerformReflectPrompt: string;
    kenyaPerformReflectSpeechAudioLabel: string;
    kenyaPerformRubricStrongLabel: string;
    kenyaPerformRubricPracticeLabel: string;
    kenyaPerformFinishButton: string;
    kenyaPerformReplayFinishButton: string;
    kenyaPerformCeremonyBadge: string;
    kenyaPerformCeremonyTitle: string;
    kenyaPerformCeremonySubtitle: string;
    kenyaPerformCeremonyReplaySubtitle: string;
    kenyaPerformAmbassadorTitle: string;
    kenyaPerformTotalXpNote: string;
    kenyaPerformCumulativeXpNote: string;
    kenyaPerformStayKenyaButton: string;
    kenyaPerformViewPassportButton: string;
    worldMapCompletedBadge: string;
    // Phase 3A: Scotland (Highland Heroes) 3D World Foundation & World Map Statuses
    worldMapStatusAvailable: string;
    worldMapStatusInProgress: string;
    worldMapStatusLocked: string;
    worldMapStatusComingSoon: string;
    worldMapScotlandUnlockHint: string;
    worldMapComingSoonHint: string;
    worldMapEgyptUnlockedBadge: string;
    worldMapEgyptUnlockedHint: string;
    worldMapComingSoonButton: string;
    worldMapLockedButton: string;
    arrivingScotlandTitle: string;
    arrivingScotlandSubtitle: string;
    scotlandHudTitle: string;
    scotlandHudSubtitle: string;
    scotlandBackToHighlands: string;
    scotlandFallback2dNotice: string;
    scotlandExploredCountLabel: string;
    scotlandObjectiveExplore: string;
    scotlandObjectiveDone: string;
    scotlandSpeakWithPrefix: string;
    scotlandExploreSpotPrefix: string;
    scotlandContinueButton: string;
    scotlandCloseButton: string;
    scotlandCulturalFocusLabel: string;
    scotlandEverydayVsTraditionLabel: string;
    scotlandComparePromptLabel: string;
    scotlandMarkExploredButton: string;
    scotlandAlreadyExploredLabel: string;
    scotlandExplorationNote: string;
    // Phase 3B: Scotland DISCOVER — Scottish Culture Quest
    scotlandDiscoverStageBadge: string;
    scotlandStartCultureQuestButton: string;
    scotlandOpenJournalButton: string;
    scotlandEvidenceHudLabel: string;
    scotlandObjectiveTalkEilidhStart: string;
    scotlandObjectiveCollectEvidence: string;
    scotlandObjectiveDiscoverComplete: string;
    scotlandDiscoverBannerTitle: string;
    scotlandDiscoverBannerSubtitle: string;
    scotlandStartQuestPromptNote: string;
    scotlandInspectionBeforeQuestNote: string;
    scotlandLaunchChallengeButton: string;
    scotlandJournalTitle: string;
    scotlandJournalSubtitle: string;
    scotlandJournalLockedCardHint: string;
    scotlandJournalFactLabel: string;
    scotlandJournalVocabLabel: string;
    scotlandJournalThaiLinkLabel: string;
    scotlandJournalCompareLabel: string;
    scotlandSimilarityShortLabel: string;
    scotlandDifferenceShortLabel: string;
    scotlandLanguageBridgeLabel: string;
    scotlandJournalCompleteNote: string;
    scotlandJournalProgressNote: string;
    scotlandScaffoldModeLabel: string;
    scotlandModeA2Label: string;
    scotlandModeB1Label: string;
    scotlandHintButton: string;
    scotlandStationSavedTitle: string;
    scotlandStationFirstSaveNote: string;
    scotlandStationReplayNote: string;
    scotlandReplayActivityButton: string;
    scotlandContinueExploringButton: string;
    scotlandReadLandmarkNoteButton: string;
    scotlandStation1Instruction: string;
    scotlandClassifyPrompt: string;
    scotlandStation2Instruction: string;
    scotlandMatchPurposePrompt: string;
    scotlandFinalInsightLabel: string;
    scotlandCountryLabel: string;
    scotlandBothCountriesLabel: string;
    scotlandThailandLabel: string;
    scotlandStation3Instruction: string;
    scotlandInspectIngredientsButton: string;
    scotlandFoodComparePrompt: string;
    scotlandStation4Instruction: string;
    scotlandPlaySoundCueButton: string;
    scotlandIdentifyRolePrompt: string;
    scotlandStation5Instruction: string;
    scotlandPlaceCompassZonePrompt: string;
    scotlandLanguageBridgePreviewTitle: string;
    scotlandRouteTabLabel: string;
    scotlandEvidenceTabLabel: string;
    scotlandRecommendedNextLabel: string;
    scotlandGuideMeButton: string;
    scotlandGuidingActiveLabel: string;
    scotlandClearGuideButton: string;
    scotlandStatusCompleted: string;
    scotlandStatusVisited: string;
    scotlandStatusNotVisited: string;
    scotlandHudGuidingPrefix: string;
    scotlandAllStationsDoneNote: string;
    scotlandOpenCardButton: string;
    scotlandHotspotMapTitle: string;
    scotlandBucketsTitle: string;
    scotlandWeaveStepTitle: string;
    scotlandToggleWarpButton: string;
    scotlandToggleWeftButton: string;
    scotlandWeaveCompareContinue: string;
    scotlandPairLeftTitle: string;
    scotlandPairRightTitle: string;
    scotlandPantryShelfTitle: string;
    scotlandMixingBowlTitle: string;
    scotlandBowlReadyNote: string;
    scotlandMysteryAudioPrompt: string;
    scotlandCompassTrayTitle: string;
    scotlandCompassBoardHint: string;
    // Country Replay & Restart Current Attempt
    replayCountryButton: string;
    restartAttemptButton: string;
    replayModeLabel: string;
    replayAttemptPrefix: string;
    replayStagePrefix: string;
    replayAttemptCompleteLabel: string;
    replayConfirmTitle: string;
    restartConfirmTitle: string;
    replayConfirmBody: string;
    restartConfirmBody: string;
    replayPreservedTitle: string;
    replayPreservedDetail: string;
    replayScotlandScopeNote: string;
    replayConfirmActionButton: string;
    restartConfirmActionButton: string;
    cancelButton: string;
    replayNoExtraXpLabel: string;
    scotlandDiscoverReplayBannerTitle: string;
    scotlandBuildStageBadge: string;
    scotlandObjectiveTalkEilidhBuild: string;
    scotlandObjectiveBuild: string;
    scotlandObjectiveBuildComplete: string;
    scotlandBuildHudLabel: string;
    scotlandStartBuildButton: string;
    scotlandBuildBannerTitle: string;
    scotlandBuildReplayBannerTitle: string;
    scotlandBuildBannerSubtitle: string;
    scotlandBuildSavedTitle: string;
    scotlandBuildFirstSaveNote: string;
    scotlandBuildReplayNote: string;
    scotlandBuildCraftedLabel: string;
    scotlandBuildInspectDiscoverCardButton: string;
    scotlandBuildPracticeReadinessNote: string;
    scotlandBuildSubmitButton: string;
    scotlandBuildClearTilesButton: string;
    scotlandBuildTrySpeakLabel: string;
    scotlandBuildCheckSpeakingButton: string;
    scotlandBuildStopListeningButton: string;
    scotlandBuildNoSpeechNote: string;
    scotlandJournalBuiltSentenceLabel: string;
    scotlandPracticeStageBadge: string;
    scotlandPracticeHudLabel: string;
    scotlandObjectiveTalkEilidhPractice: string;
    scotlandObjectivePractice: string;
    scotlandObjectivePerformUnlocked: string;
    scotlandStartPracticeButton: string;
    scotlandPracticeBannerTitle: string;
    scotlandPracticeReplayBannerTitle: string;
    scotlandPracticeBannerSubtitle: string;
    scotlandPracticeReviewBuildButton: string;
    scotlandPracticeDoneBadge: string;
    scotlandPracticeStepListen: string;
    scotlandPracticeStepPrepare: string;
    scotlandPracticeStepSpeak: string;
    scotlandPracticeStepReview: string;
    scotlandPracticeStepComplete: string;
    scotlandPracticeStopAudioButton: string;
    scotlandPracticeListenPromptButton: string;
    scotlandPracticeSpeakPromptNote: string;
    scotlandPracticeEvidenceLinkHeading: string;
    scotlandPracticeBuildLinkHeading: string;
    scotlandPracticeOtherBuiltHeading: string;
    scotlandPracticeKeyTermsHeading: string;
    scotlandPracticeFramesHeading: string;
    scotlandPracticeModelHeading: string;
    scotlandPracticeHideFramesLabel: string;
    scotlandPracticeShowFramesLabel: string;
    scotlandPracticeFollowUpBadge: string;
    scotlandPracticeFollowUpInstruction: string;
    scotlandPracticeFollowUpNoMicCheck: string;
    scotlandPracticeFollowUpRequiredNote: string;
    scotlandPracticeCheckCompare: string;
    scotlandPracticeCheckExample: string;
    scotlandPracticeCheckSimDiff: string;
    scotlandPracticeCheckClear: string;
    scotlandPracticeChecklistHint: string;
    scotlandPracticeGuidanceHeading: string;
    scotlandPracticeGuidanceHonestNote: string;
    scotlandPracticeListenModelButton: string;
    scotlandPracticeSaveCompleteButton: string;
    scotlandPracticeReturnWorldButton: string;
    scotlandPracticeNoMicIntro: string;
    scotlandPracticeNoMicAloudCheck: string;
    scotlandPracticeAllFiveEarnedNote: string;
    scotlandPerformStageBadge: string;
    scotlandObjectiveStartPerform: string;
    scotlandObjectivePerformShowcase: string;
    scotlandObjectiveScotlandComplete: string;
    scotlandPerformHudReady: string;
    scotlandPerformHudDone: string;
    scotlandStartPerformButton: string;
    scotlandGoLochsideShowcaseButton: string;
    scotlandPerformBannerTitle: string;
    scotlandPerformReplayBannerTitle: string;
    scotlandPerformBannerSubtitle: string;
    scotlandPerformTitle: string;
    scotlandPerformMissionBadge: string;
    scotlandPerformTargetDuration: string;
    scotlandPerformLocationLabel: string;
    scotlandPerformStepInvitation: string;
    scotlandPerformStepPrepare: string;
    scotlandPerformStepSpeech: string;
    scotlandPerformStepQa: string;
    scotlandPerformStepReflect: string;
    scotlandPerformInvitationHeading: string;
    scotlandPerformExpectationsHeading: string;
    scotlandPerformListenInstructions: string;
    scotlandPerformShowThaiSupport: string;
    scotlandPerformHideThaiSupport: string;
    scotlandPerformStartPrepButton: string;
    scotlandPerformEvidenceHeading: string;
    scotlandPerformEvidenceHint: string;
    scotlandPerformEvidenceCountLabel: string;
    scotlandPerformYourBuildQuoteLabel: string;
    scotlandPerformPlannerHeading: string;
    scotlandPerformPlannerHint: string;
    scotlandPerformInsertStarterButton: string;
    scotlandPerformConnectorsHeading: string;
    scotlandPerformShowSampleButton: string;
    scotlandPerformHideSampleButton: string;
    scotlandPerformGoSpeechButton: string;
    scotlandPerformSpeechHeading: string;
    scotlandPerformSpeechSubtitle: string;
    scotlandPerformTimerGuidanceLabel: string;
    scotlandPerformToggleNotesButton: string;
    scotlandPerformNoMicAloudCheck: string;
    scotlandPerformGoQaButton: string;
    scotlandPerformQaHeading: string;
    scotlandPerformQaIntro: string;
    scotlandPerformQaDoneBadge: string;
    scotlandPerformQaNoMicCheck: string;
    scotlandPerformGoReflectButton: string;
    scotlandPerformReflectHeading: string;
    scotlandPerformReflectAudioHeading: string;
    scotlandPerformReflectChecklistPrompt: string;
    scotlandPerformReflectGuidanceTitle: string;
    scotlandPerformReflectDisclaimer: string;
    scotlandPerformFinishButton: string;
    scotlandPerformReplayFinishButton: string;
    scotlandPerformCeremonyBadge: string;
    scotlandPerformCeremonyTitle: string;
    scotlandPerformAmbassadorTitle: string;
    scotlandPerformCeremonySubtitle: string;
    scotlandPerformCeremonyReplaySubtitle: string;
    scotlandPerformTotalXpNote: string;
    scotlandPerformCumulativeXpNote: string;
    scotlandPerformStayScotlandButton: string;
    scotlandPerformViewPassportButton: string;
    scotlandPerformReplayButton: string;
    scotlandLochsideInviteBadge: string;
    scotlandLochsideReviewPracticeButton: string;
    worldMapAustraliaUnlockHint: string;
    australiaBackToSydney: string;
    arrivingAustraliaTitle: string;
    arrivingAustraliaSubtitle: string;
    australiaExploreStageBadge: string;
    australiaObjectiveExplore: string;
    australiaObjectiveMeetAllNpcs: string;
    australiaObjectiveReadyNextPhase: string;
    australiaControlsHint: string;
    australiaFallback2dNotice: string;
    australiaCityGuideButton: string;
    australiaCityGuideTitle: string;
    australiaCityGuideSubtitle: string;
    australiaCityGuideTabRoute: string;
    australiaCityGuideTabDistricts: string;
    australiaCityGuideRouteTitle: string;
    australiaCityGuideRouteDesc: string;
    australiaCityGuideNextStopBadge: string;
    australiaCityGuideAllVisitedNote: string;
    australiaCityGuideVisitedBadge: string;
    australiaCityGuideNotVisitedBadge: string;
    australiaCityGuideGuideMeButton: string;
    australiaCityGuideGuidingActiveButton: string;
    australiaCityGuideStopGuideButton: string;
    australiaCityGuideLanguageFocusLabel: string;
    australiaCityGuideCulturalNoteLabel: string;
    australiaCityGuidePhaseNote: string;
    australiaListenDialogue: string;
    australiaNextTipButton: string;
    australiaCloseDialogButton: string;
    australiaPauseTitle: string;
    australiaPauseSubtitle: string;
    australiaResumeButton: string;
    australiaLandmarkPreviewBadge: string;
    australiaLandmarkPhase4BNote: string;
    australiaDiscoverStartButton: string;
    australiaDiscoverStartedToast: string;
    australiaDiscoverPlayMissionButton: string;
    australiaDiscoverReviewMissionButton: string;
    australiaDiscoverCompletedBadge: string;
    australiaDiscoverPlayableBadge: string;
    australiaDiscoverLockedNeedOlivia: string;
    australiaDiscoverLockedPrevious: string;
    australiaDiscoverBuildUnlockedTitle: string;
    australiaDiscoverBuildUnlockedNote: string;
    australiaDiscoverStageCompleteReward: string;
    australiaDiscoverCefrA2Label: string;
    australiaDiscoverCefrB1Label: string;
    australiaDiscoverHearButton: string;
    australiaDiscoverReplayAudioButton: string;
    australiaDiscoverStopAudioButton: string;
    australiaDiscoverHintButton: string;
    australiaDiscoverHideHintButton: string;
    australiaDiscoverReshuffleButton: string;
    australiaDiscoverNextChallengeButton: string;
    australiaDiscoverFinishMissionButton: string;
    australiaDiscoverReturnSydneyButton: string;
    australiaDiscoverFictionalNotice: string;
    australiaDiscoverCafeTrayTitle: string;
    australiaDiscoverCafeMenuTitle: string;
    australiaDiscoverBoardTabTimes: string;
    australiaDiscoverBoardTabTickets: string;
    australiaDiscoverBoardTabInclusions: string;
    australiaDiscoverRepairReplyLabel: string;
    australiaDiscoverCompletedSummaryTitle: string;
    australiaBuildStageBadge: string;
    australiaBuildObjectiveStart: string;
    australiaBuildObjectiveInProgress: string;
    australiaBuildObjectiveReadyNextPhase: string;
    australiaBuildStartButton: string;
    australiaBuildPlayMissionButton: string;
    australiaBuildReviewMissionButton: string;
    australiaBuildLockedNeedDiscover: string;
    australiaBuildLockedNeedOlivia: string;
    australiaBuildLockedPrevious: string;
    australiaBuildCompletedBadge: string;
    australiaBuildPlayableBadge: string;
    australiaBuildPracticeUnlockedTitle: string;
    australiaBuildPracticeUnlockedNote: string;
    australiaBuildXpRewardOnceNote: string;
    australiaBuildGuideSectionTitle: string;
    australiaBuildGuideSectionDesc: string;
    australiaBuildSavedDialogueLabel: string;
    australiaBuildMoveUpButton: string;
    australiaBuildMoveDownButton: string;
    australiaBuildRemoveCardButton: string;
    australiaBuildUndoTileButton: string;
    australiaBuildClearButton: string;
    australiaBuildCheckAnswerButton: string;
    australiaBuildSequenceStripTitle: string;
    australiaBuildSequencePoolTitle: string;
    australiaBuildTileStripTitle: string;
    australiaBuildTilePoolTitle: string;
    australiaBuildFunctionSelectorTitle: string;
    australiaBuildRouteDiagramTitle: string;
    australiaBuildCafeTurnsTitle: string;
    australiaBuildTicketQuestionLabel: string;
    australiaBuildTicketFollowUpLabel: string;
    australiaBuildRescueStep1Title: string;
    australiaBuildRescueStep2Title: string;
    australiaBuildRescueStep3Title: string;
    australiaBuildHearFullDialogueButton: string;
    australiaBuildChallengeCompleteTitle: string;
    australiaBuildNextChallengeButton: string;
    australiaBuildFinishMissionButton: string;
    australiaBuildModeBadge: string;
    australiaBuildReviewDiscoverToggle: string;
    australiaPracticeStageBadge: string;
    australiaPracticeModeBadge: string;
    australiaPracticeObjectiveStart: string;
    australiaPracticeObjectiveInProgress: string;
    australiaPracticeObjectiveReadyNextPhase: string;
    australiaPracticeStartButton: string;
    australiaPracticePlayMissionButton: string;
    australiaPracticeReviewMissionButton: string;
    australiaPracticeCompletedBadge: string;
    australiaPracticePlayableBadge: string;
    australiaPracticeLockedNeedOlivia: string;
    australiaPracticeLockedPrevious: string;
    australiaPracticePerformUnlockedTitle: string;
    australiaPracticePerformUnlockedNote: string;
    australiaPracticeXpRewardOnceNote: string;
    australiaPracticeGuideSectionTitle: string;
    australiaPracticeGuideSectionDesc: string;
    australiaPracticeReviewBuildToggle: string;
    australiaPracticeHelpPointReuseBadge: string;
    australiaPracticeEvidenceBadgeMic: string;
    australiaPracticeEvidenceBadgeNoMic: string;
    australiaPracticeStepListen: string;
    australiaPracticeStepPrepare: string;
    australiaPracticeStepSpeak: string;
    australiaPracticeStepReview: string;
    australiaPracticeStepComplete: string;
    australiaPracticeListenPromptButton: string;
    australiaPracticeStopAudioButton: string;
    australiaPracticeReplayTurnButton: string;
    australiaPracticeHearClosingButton: string;
    australiaPracticeShowStartersButton: string;
    australiaPracticeShowModelButton: string;
    australiaPracticeHearModelButton: string;
    australiaPracticeShowThaiTipButton: string;
    australiaPracticeYourBuiltDialogueLabel: string;
    australiaPracticeUsefulExpressionsLabel: string;
    australiaPracticeStartMicButton: string;
    australiaPracticeStopMicButton: string;
    australiaPracticeRecordingActiveLabel: string;
    australiaPracticePlaybackButton: string;
    australiaPracticeStopPlaybackButton: string;
    australiaPracticeRetryRecordingButton: string;
    australiaPracticeAcceptTurnButton: string;
    australiaPracticeSwitchNoMicButton: string;
    australiaPracticeSwitchMicButton: string;
    australiaPracticeNoMicTitle: string;
    australiaPracticeNoMicNotice: string;
    australiaPracticeNoMicConfirmCheck: string;
    australiaPracticeMicPrivacyNote: string;
    australiaPracticeMicErrorDenied: string;
    australiaPracticeMicErrorNotFound: string;
    australiaPracticeMicErrorUnsupported: string;
    australiaPracticeMicErrorUnknown: string;
    australiaPracticeRecordingDeferredNotice: string;
    australiaPracticeProceedPrepareButton: string;
    australiaPracticeProceedSpeakButton: string;
    australiaPracticeProceedReviewButton: string;
    australiaPracticeBackToPrepareButton: string;
    australiaPracticeReviewTitle: string;
    australiaPracticeReviewDisclaimer: string;
    australiaPracticeSelectAtLeastOneCheck: string;
    australiaPracticeCompleteMissionButton: string;
    australiaPracticeCompletedTitle: string;
    australiaPracticeReplayMissionButton: string;
    australiaPracticeReturnCityButton: string;
    australiaPracticeTurnProgressLabel: string;
    australiaPracticeNpcRepliedBadge: string;
    australiaPracticeMenuQuickRefTitle: string;
    australiaPracticeBoardQuickRefTitle: string;
    // Phase 4E: Australia PERFORM — Final Sydney CityTalk Challenge & Egypt Preview
    australiaPerformStageBadge: string;
    australiaCompletedStageBadge: string;
    australiaPerformObjectiveStart: string;
    australiaPerformObjectiveInProgress: string;
    australiaPerformObjectiveReflection: string;
    australiaPerformObjectiveCompleted: string;
    australiaPerformStartButton: string;
    australiaPerformPlayChallengeButton: string;
    australiaPerformReviewChallengeButton: string;
    australiaPerformStartReflectionButton: string;
    australiaPerformViewCelebrationButton: string;
    australiaPerformGuideSectionTitle: string;
    australiaPerformGuideSectionDesc: string;
    australiaPerformLockedNeedOlivia: string;
    australiaPerformLockedPrevious: string;
    australiaPerformCompletedBadge: string;
    australiaPerformPlayableBadge: string;
    australiaPerformMissionBadge: string;
    australiaPerformStepBriefing: string;
    australiaPerformStepInteract: string;
    australiaPerformStepRespond: string;
    australiaPerformStepReview: string;
    australiaPerformStepComplete: string;
    australiaPerformBeginChallengeButton: string;
    australiaPerformProceedRespondButton: string;
    australiaPerformProceedReviewButton: string;
    australiaPerformBackToInteractButton: string;
    australiaPerformShowBuildScriptButton: string;
    australiaPerformHideBuildScriptButton: string;
    australiaPerformBuildScriptLabel: string;
    australiaPerformVocabToggleLabel: string;
    australiaPerformStartersToggleLabel: string;
    australiaPerformStrategyToggleLabel: string;
    australiaPerformHintToggleShow: string;
    australiaPerformHintToggleHide: string;
    australiaPerformReflectionHeading: string;
    australiaPerformReflectionSubtitle: string;
    australiaPerformReflectionRequiredNote: string;
    australiaPerformFinishReflectionButton: string;
    australiaPerformFinishReplayButton: string;
    australiaPerformSummaryTitle: string;
    australiaPerformCelebrationBadge: string;
    australiaPerformAmbassadorTitle: string;
    australiaPerformCelebrationSubtitle: string;
    australiaPerformCelebrationReplaySubtitle: string;
    australiaPerformTotalXpNote: string;
    australiaPerformCumulativeXpNote: string;
    australiaPerformViewPassportButton: string;
    australiaPerformReturnMapButton: string;
    australiaPerformReplayCountryButton: string;
    australiaPerformStaySydneyButton: string;
    australiaPerformGoldenToastTitle: string;
    australiaPerformGoldenToastBody: string;
    australiaPerformReviewPromptLabel: string;
    australiaPerformNoAutoAnswerNote: string;
    australiaPerformReflectionGateNotice: string;
    australiaPerformCompleteReflectionButton: string;
    australiaPerformResumeReflectionButton: string;
    worldMapAustraliaReflectionPendingHint: string;
    navGoToNextMission: string;
    navPlacesButton: string;
    navAutoWalkButton: string;
    navQuickTravelButton: string;
    navCancelWalkButton: string;
    navClearDestinationButton: string;
    navGuideOnlyButton: string;
    navWalkingToPrefix: string;
    navArrivedAtPrefix: string;
    navQuickTravelArrivedPrefix: string;
    navAlreadyNearbyPrefix: string;
    navCancelledManual: string;
    navCancelledPrefix: string;
    navUnreachable: string;
    navComingSoonAustraliaBuild: string;
    navComingSoonAustraliaPractice: string;
    navComingSoonAustraliaPerform: string;
    navCountryCompletedNote: string;
    navRecommendedBadge: string;
    navPlacesMenuTitle: string;
    navPlacesMenuSubtitle: string;
    navZeroRewardHint: string;
    navStatusCompleted: string;
    navStatusVisited: string;
    navStatusOpen: string;
    navNoNextMissionNote: string;
    // Phase 5A: Egypt — Echoes of Egypt (3D World Foundation & Exploration)
    worldMapEgyptUnlockHint: string;
    worldMapEgyptEnterableBadge: string;
    worldMapEgyptEnterableHint: string;
    egyptBackToGiza: string;
    arrivingEgyptTitle: string;
    arrivingEgyptSubtitle: string;
    egyptExploreStageBadge: string;
    egyptObjectiveExplore: string;
    egyptObjectiveMeetAllNpcs: string;
    egyptObjectiveAllSitesVisited: string;
    egyptControlsHint: string;
    egyptFallback2dNotice: string;
    egyptGuideButton: string;
    egyptGuideTitle: string;
    egyptGuideSubtitle: string;
    egyptGuideTabRoute: string;
    egyptGuideTabSites: string;
    egyptGuideTabStages: string;
    egyptGuideRouteTitle: string;
    egyptGuideRouteDesc: string;
    egyptGuideNextStopBadge: string;
    egyptGuideAllVisitedNote: string;
    egyptGuideVisitedBadge: string;
    egyptGuideNotVisitedBadge: string;
    egyptGuideGuideMeButton: string;
    egyptGuideGuidingActiveButton: string;
    egyptGuideStopGuideButton: string;
    egyptGuideLanguageFocusLabel: string;
    egyptGuideCulturalNoteLabel: string;
    egyptGuideFutureStagesNote: string;
    egyptGuideStageDiscoverTitle: string;
    egyptGuideStageDiscoverDesc: string;
    egyptGuideStageBuildTitle: string;
    egyptGuideStageBuildDesc: string;
    egyptGuideStagePracticeTitle: string;
    egyptGuideStagePracticeDesc: string;
    egyptGuideStagePerformTitle: string;
    egyptGuideStagePerformDesc: string;
    egyptGuideComingSoonPhase5B: string;
    egyptGuideLockedFuturePhase: string;
    egyptGuideZeroXpExplorationNote: string;
    egyptListenDialogue: string;
    egyptReplayDialogue: string;
    egyptStopAudio: string;
    egyptNextTipButton: string;
    egyptCloseDialogButton: string;
    egyptPauseTitle: string;
    egyptPauseSubtitle: string;
    egyptResumeButton: string;
    egyptLandmarkBadge: string;
    egyptChamberSealedBadge: string;
    egyptChamberSealedBanner: string;
    egyptFictionalVsHistoricalLabel: string;
    egyptZeroXpExploreNote: string;
    egyptHudSitesLabel: string;
    egyptHudNpcsLabel: string;
    egyptHudGuidingPrefix: string;
    egyptSpeakWithPrefix: string;
    egyptExploreSitePrefix: string;
    // Phase 5B: Egypt Stage 1 DISCOVER — Secrets of the Pharaohs
    egyptDiscoverStageBadge: string;
    egyptDiscoverPlayMissionButton: string;
    egyptDiscoverReviewMissionButton: string;
    egyptDiscoverCompletedBadge: string;
    egyptDiscoverLockedNeedLayla: string;
    egyptDiscoverLockedPrevious: string;
    egyptDiscoverViaGuideTipNote: string;
    egyptDiscoverCefrA2Label: string;
    egyptDiscoverCefrB1Label: string;
    egyptDiscoverCefrSwitchNotice: string;
    egyptDiscoverHearButton: string;
    egyptDiscoverReplayAudioButton: string;
    egyptDiscoverStopAudioButton: string;
    egyptDiscoverHintButton: string;
    egyptDiscoverNextHintButton: string;
    egyptDiscoverCheckButton: string;
    egyptDiscoverUndoButton: string;
    egyptDiscoverResetButton: string;
    egyptDiscoverNextChallengeButton: string;
    egyptDiscoverFinishStationButton: string;
    egyptDiscoverReturnGizaButton: string;
    egyptDiscoverReplayStationButton: string;
    egyptDiscoverStageCompleteTitle: string;
    egyptDiscoverStageCompleteReward: string;
    egyptDiscoverKnowledgeSealTitle: string;
    egyptDiscoverKnowledgeSealNote: string;
    egyptDiscoverBuildComingSoonTitle: string;
    egyptDiscoverBuildComingSoonDesc: string;
    egyptDiscoverZeroXpStationNote: string;
    egyptDiscoverStageIntroLabel: string;
    egyptDiscoverStationsProgressLabel: string;
    egyptDiscoverAvailableBadge: string;
    egyptDiscoverLockedBadge: string;
    egyptDiscoverBuildPreviewBadge: string;
    egyptNileWaterBoundaryToast: string;
    egyptChamberSealedDoorToast: string;
    // Phase 5C: Egypt Stage 2 BUILD — Ancient Instruction Builder & Journal
    egyptBuildStageBadge: string;
    egyptBuildIntroLabel: string;
    egyptBuildStationsProgressLabel: string;
    egyptBuildPlayWorkshopButton: string;
    egyptBuildReviewWorkshopButton: string;
    egyptBuildCompletedBadge: string;
    egyptBuildLockedNeedDiscover: string;
    egyptBuildLockedNeedLayla: string;
    egyptBuildLockedPrevious: string;
    egyptBuildTestRouteButton: string;
    egyptBuildCheckSignButton: string;
    egyptBuildVerifyScrollButton: string;
    egyptBuildSaveBlueprintButton: string;
    egyptBuildStageCompleteTitle: string;
    egyptBuildStageCompleteReward: string;
    egyptBuildBuilderSealTitle: string;
    egyptBuildBuilderSealNote: string;
    egyptBuildPracticeComingSoonTitle: string;
    egyptBuildPracticeComingSoonDesc: string;
    egyptBuildZeroXpStationNote: string;
    egyptBuildOpenJournalButton: string;
    egyptJournalTabLabel: string;
    egyptJournalTitle: string;
    egyptJournalSubtitle: string;
    egyptJournalEmptyState: string;
    egyptJournalRevisionPolicyNote: string;
    egyptJournalListenButton: string;
    egyptJournalBlueprintPreviewTitle: string;
  }
> = {
  en: {
    brandName: 'VoxVoyage',
    tagline: 'Your Voice. Your Voyage.',
    playButton: 'PLAY',
    continueButton: 'CONTINUE ADVENTURE',
    settingsButton: 'Settings',
    closeSettings: 'Close',
    enterWorldButton: 'ENTER WORLD',
    backToMap: 'World Map',
    backToTitle: 'Title Screen',
    openPassport: 'Passport',
    settingsTitle: 'Game Settings',
    appearanceLabel: 'Sky & Lighting',
    modeDay: 'Day',
    modeNight: 'Night',
    modeAuto: 'Auto',
    musicLabel: 'Background Music',
    sfxLabel: 'Sound Effects',
    onLabel: 'On',
    offLabel: 'Off',
    tapToPlay: 'Tap to Play',
    languageLabel: 'Language',
    motionLabel: 'Animations',
    motionReduced: 'Reduced',
    motionStandard: 'Standard',
    viewModeLabel: 'World View',
    view3D: '3D Globe',
    view2D: '2D Map',
    worldMapPrompt: 'Select a destination on the globe',
    dragHint: 'Drag to spin · Tap a marker',
    webglFallbackNotice: '3D view is unavailable here — using 2D World Map.',
    xpLabel: 'XP',
    coinsLabel: 'Coins',
    gemsLabel: 'Gems',
    stampsLabel: 'Stamps',
    comingSoonLabel: 'Coming Soon',
    lockedLabel: 'Locked',
    missionStagesTitle: 'Adventure Stages',
    finalChallengeLabel: 'Final Speaking Quest',
    passportTitle: 'Explorer Passport',
    passportEmptyHint: 'Complete country adventures to collect Passport Stamps.',
    resetProgress: 'Reset Saved Adventure',
    resetDone: 'Adventure progress reset.',
    avatarTitle: 'Explorer Look',
    avatarComingSoon: 'Full 3D Avatar Customization unlocks soon. Ready to explore!',
    continueToWorldMap: 'Go to World Map',
    speakHint: 'Meet your local guide before starting your speaking adventure.',
    avatarStudioTitle: 'Create Your Explorer',
    explorerNameLabel: 'Explorer Name',
    explorerNamePlaceholder: 'Enter explorer name',
    backButton: 'Back',
    randomizeButton: 'Randomize',
    waveButton: 'Greet',
    confirmExplorerButton: 'Confirm Explorer',
    tabBodySkin: 'Model & Skin',
    tabHair: 'Hair',
    tabOutfit: 'Outfit',
    tabBackpack: 'Backpack',
    baseModelLabel: 'Explorer Style',
    skinToneLabel: 'Skin Tone',
    hairStyleLabel: 'Hairstyle',
    hairColorLabel: 'Hair Color',
    travelOutfitLabel: 'Travel Outfit',
    outfitColorLabel: 'Outfit Color',
    backpackColorLabel: 'Backpack Color',
    rotateAvatarHint: 'Drag to turn 360°',
    passportIntroTitle: 'Your Explorer Passport Is Ready!',
    passportIntroMessage: 'Travel across 5 countries, speak English with local guides, and collect every Passport Stamp.',
    enterWorldMapButton: 'Enter World Map',
    editExplorerButton: 'Edit Look',
    arrivingJaipurTitle: 'Arriving in Jaipur',
    arrivingJaipurSubtitle: 'The Pink City · Rajasthan, India',
    jaipurLandmarksLabel: 'Landmarks',
    jaipurMoveHint: 'WASD / Arrows to Walk',
    jaipurCameraHint: 'Drag to Look · E to Interact',
    jaipurInteractLabel: 'Interact',
    jaipurInteractPromptPrefix: 'Press E or Tap:',
    jaipurSpeakWithAarav: 'Talk to Aarav',
    jaipurInspectLandmark: 'Inspect',
    jaipurExploreCompleteBadge: 'All 3 Jaipur Landmarks Explored!',
    jaipurFallbackNotice: '2D Jaipur Courtyard view active — walk and explore all 3 landmarks.',
    jaipurNextButton: 'Continue',
    jaipurListenButton: 'Listen',
    jaipurCameraSensitivity: 'Camera',
    jaipurSensitivityLow: 'Gentle',
    jaipurSensitivityMed: 'Normal',
    jaipurSensitivityHigh: 'Fast',
    jaipurTouchPadShow: 'Touch Pad',
    jaipurTouchPadHide: 'Hide Pad',
    jaipurBackToJaipur: 'Return to Jaipur',
    jaipurCulturalNoteLabel: 'Explorer Field Note',
    jaipurObjectiveTalkAarav: 'Talk to Aarav Sharma',
    jaipurObjectiveFindObjects: 'Word Detective: Find 5 objects',
    jaipurObjectiveCompleted: 'Word Detective Complete',
    jaipurObjectsFoundLabel: 'Objects Found',
    jaipurPauseMenuTitle: 'Paused',
    jaipurResumeButton: 'Resume',
    jaipurWordFoundBadge: 'Added to Word Detective!',
    jaipurWordAlreadyFoundBadge: 'Already Collected',
    jaipurStartExploringButton: "Let's Explore!",
    jaipurCelebrationTitle: 'Word Detective Complete!',
    jaipurCelebrationSubtitle: 'You discovered all 5 Jaipur words. Great exploring!',
    jaipurFallback2dObjectiveNotice: '2D Accessible Mode — Walk or tap Aarav and all 5 objects.',
    jaipurBuildUnlockedNoticeTitle: 'New Quest Unlocked: Sentence Train',
    jaipurBuildUnlockedNoticeBody: 'Return to Aarav Sharma to build 5 Jaipur sentences.',
    jaipurObjectiveTalkAaravBuild: 'Talk to Aarav: Sentence Train',
    jaipurObjectivePracticeUnlocked: 'Sentence Train Complete · Practice Unlocked',
    jaipurStartSentenceTrainButton: 'Start Sentence Train',
    jaipurReplaySentenceTrainButton: 'Replay Sentence Train',
    sentenceTrainTitle: 'Sentence Train',
    sentenceTrainCounterLabel: 'Sentence',
    sentenceTrainTrackHint: 'Tap or drag words onto the train track in order.',
    sentenceTrainBankLabel: 'Word Tiles',
    sentenceTrainUndoButton: 'Undo',
    sentenceTrainResetButton: 'Reset',
    sentenceTrainCheckButton: 'Check Answer',
    sentenceTrainNextButton: 'Next Sentence',
    sentenceTrainFinishButton: 'Complete Train',
    sentenceTrainSuccessBanner: 'Well done! Your sentence is right on track!',
    sentenceTrainCelebrateTitle: 'Sentence Train Complete!',
    sentenceTrainCelebrateSubtitle: 'You built all 5 Jaipur sentences. Stage 3: Practice is now unlocked!',
    sentenceTrainPracticeUnlockedTag: 'Stage 3 Unlocked: Practice',
    sentenceTrainReplayNotice: 'Practice replay mode — already completed',
    jaipurPracticeUnlockNoticeTitle: 'New Quest Unlocked: Spot & Speak',
    jaipurPracticeUnlockNoticeBody: 'Return to Aarav Sharma to begin guided speaking practice.',
    jaipurObjectiveTalkAaravPractice: 'Talk to Aarav: Spot & Speak',
    jaipurObjectiveSpotAndSpeak: 'Spot & Speak: Practice 5 spots',
    jaipurObjectivePerformUnlocked: 'Spot & Speak Complete · Perform Unlocked',
    jaipurStartSpotAndSpeakButton: 'Start Spot & Speak',
    jaipurSpeakHerePrompt: 'Spot & Speak',
    spotSpeakNextSpotPrefix: 'Next spot:',
    spotSpeakProgressLabel: 'Spoken',
    spotSpeakStepLook: '1. Look',
    spotSpeakStepListen: '2. Listen',
    spotSpeakStepSpeak: '3. Speak',
    spotSpeakStepReview: '4. Review',
    spotSpeakHintsToggleShow: 'Show Vocabulary Hints',
    spotSpeakHintsToggleHide: 'Hide Vocabulary Hints',
    spotSpeakModelLabel: 'Model Sentence',
    spotSpeakAudioNotice: 'Browser voice model (speech synthesis)',
    spotSpeakStartMicButton: 'Start Recording',
    spotSpeakStopMicButton: 'Stop Recording',
    spotSpeakRecordingStatus: 'Recording',
    spotSpeakPlaybackButton: 'Play Recording',
    spotSpeakPauseAudioButton: 'Pause Playback',
    spotSpeakRetryButton: 'Retry',
    spotSpeakMicDeniedNotice: 'Microphone permission was denied. You can continue with No-Microphone Practice below.',
    spotSpeakMicUnavailableNotice: 'Microphone recording is unavailable on this device. Use No-Microphone Practice below.',
    spotSpeakNoMicToggle: 'Practice without microphone',
    spotSpeakMicToggle: 'Use microphone recording',
    spotSpeakNoMicPrompt: 'Read the model sentence aloud, then pick the matching phrase from the sentence:',
    spotSpeakNoMicAloudCheck: 'I read the model sentence aloud clearly.',
    spotSpeakNoMicReadyButton: 'Go to Self-Review',
    spotSpeakSelfReviewHeading: 'Self-Reflection & Playback',
    spotSpeakSelfReviewDisclaimer: 'Self-check only — your voice stays on this device and is never scored by AI or saved.',
    spotSpeakConfidenceGood: 'Felt clear and ready',
    spotSpeakConfidenceRetry: 'Want another try',
    spotSpeakFeedbackPositiveLabel: 'Great job',
    spotSpeakFeedbackTipLabel: 'One tip',
    spotSpeakFeedbackNextLabel: 'Next step',
    spotSpeakContinueButton: 'Save & Continue',
    spotSpeakCelebrateTitle: 'Spot & Speak Complete!',
    spotSpeakCelebrateSubtitle: 'You practiced all 5 Jaipur landmarks! Stage 4: Perform is now unlocked.',
    spotSpeakAlreadyDoneNote: 'Already practiced — feel free to rehearse again!',
    jaipurPerformUnlockNoticeTitle: 'Final Quest Unlocked: Jaipur Showcase',
    jaipurPerformUnlockNoticeBody: 'Return to Aarav Sharma to become a Jaipur Tour Guide!',
    jaipurObjectiveTalkAaravPerform: 'Talk to Aarav: Final Showcase',
    jaipurObjectiveMissionComplete: 'Jaipur Complete · India Stamp Earned',
    jaipurStartFinalShowcaseButton: 'Start Final Showcase',
    jaipurReplayFinalShowcaseButton: 'Replay Final Showcase',
    jaipurReplaySpotAndSpeakButton: 'Spot & Speak Practice',
    showcaseMissionBadge: 'Final Performance · Stage 4',
    showcaseTitle: 'Become a Jaipur Tour Guide!',
    showcaseBriefText: 'Aarav invited visiting travelers to meet you in the courtyard. Share an original 30–60 second English tour of Jaipur using everything you learned!',
    showcaseTargetDuration: 'Recommended target: 30–60 seconds · Speak naturally in your own words',
    showcaseStepPrepare: '1. Model',
    showcaseStepPerform: '2. Perform',
    showcaseStepReflect: '3. Reflect',
    showcaseStepCeremony: '4. Stamp',
    showcaseRequirementsHeading: 'Include in Your Tour',
    showcaseModelHeading: 'Example Tour Model',
    showcaseStartersHeading: 'Useful Starters & Vocabulary',
    showcaseVocabHeading: 'Jaipur Word Bank',
    showcaseHideScaffoldButton: 'Hide Scaffolding',
    showcaseShowScaffoldButton: 'Show Scaffolding',
    showcaseScaffoldHiddenNote: 'Scaffolding hidden — deliver your tour in your own words!',
    showcaseGoPerformButton: 'Ready to Guide Travelers',
    showcaseRecordingHint: 'Greet your travelers, introduce Jaipur, describe at least 3 landmarks, and close politely.',
    showcaseNoMicHeading: 'No-Microphone Tour Builder',
    showcaseNoMicPickThreeLabel: 'Choose 3 Jaipur landmarks for your tour outline:',
    showcaseNoMicPickedCountLabel: 'Chosen',
    showcaseNoMicCustomNoteLabel: 'Add one original sentence of your own (optional):',
    showcaseNoMicCustomNotePlaceholder: 'e.g., I love the warm pink stone walls of Jaipur.',
    showcaseNoMicAloudCheck: 'I delivered my complete Jaipur tour aloud clearly.',
    showcaseGoReflectButton: 'Review & Reflect',
    showcaseReflectHeading: 'Tour Guide Self-Reflection',
    showcaseReflectChecklistPrompt: 'Check the parts you included in your tour:',
    showcaseFinishButton: 'Finish Mission & Claim Stamp',
    showcaseReplayFinishButton: 'Finish Replay',
    showcaseCeremonyBadge: 'India Mission Complete!',
    showcaseCeremonyTitle: 'India Passport Stamp Earned!',
    showcaseCeremonySubtitle: 'You guided travelers through Jaipur with your own voice!',
    showcaseCeremonyReplaySubtitle: 'Encore tour complete! Your India Passport Stamp is proudly recorded.',
    showcaseTotalXpNote: 'Total Jaipur XP earned across all 4 stages',
    showcaseViewPassportButton: 'View Passport',
    showcaseStayJaipurButton: 'Stay in Jaipur',
    passportStampIndiaLabel: 'Jaipur, India',
    passportStampDateLabel: 'Earned',
    arrivingKenyaTitle: 'Arriving in Maasai Mara',
    arrivingKenyaSubtitle: 'WildSpeak Safari · Kenya',
    kenyaObjectiveExplore: 'Explore the Maasai Mara',
    kenyaSpotsVisitedLabel: 'Safari Spots',
    kenyaSpeakWithAmina: 'Talk to Amina',
    kenyaInspectSpot: 'Observe',
    kenyaBackToMaasaiMara: 'Return to Maasai Mara',
    kenyaFallback2dNotice: '2D Accessible Mode — Walk or tap Amina and all 5 safari landmarks.',
    kenyaWildlifeNoteLabel: 'Ranger Field Note',
    kenyaReadyPreviewBadge: 'Safari Exploration · Free Roam',
    kenyaObjectiveTalkAmina: 'Talk to Ranger Amina',
    kenyaObjectiveDiscover: 'Discover the Wild!',
    kenyaDiscoverCountLabel: 'Wildlife Discoveries',
    kenyaStartMissionButton: 'Start Discovery Mission',
    kenyaOpenFieldGuideButton: 'Field Guide',
    kenyaMeetAminaFirstHint: 'Talk to Ranger Amina at Safari Ranger Camp first to start Discover the Wild!',
    kenyaCelebrationTitle: 'Discover the Wild Complete!',
    kenyaCelebrationSubtitle: '+50 XP earned! All 5 Maasai Mara wildlife facts recorded.',
    kenyaBuildUnlockedBadge: 'BUILD Stage Unlocked',
    kenyaBuildSoonNote: 'Talk to Ranger Amina — Stage 2: BUILD arrives in Phase 2C!',
    kenyaDiscoveryRecordedBadge: 'Recorded in Field Guide',
    kenyaHideThaiLabel: 'Hide Thai',
    kenyaShowThaiLabel: 'Thai Help',
    kenyaVocabHeading: 'Key Safari Vocabulary',
    kenyaTryAgainFeedback: 'Not quite! Read the field note above and try another answer.',
    kenyaDiscoverCompleteInlineNote: '5/5 Complete! +50 XP & BUILD Stage Unlocked!',
    kenyaDiscoverySavedNote: 'Discovery saved to your Wildlife Field Guide!',
    kenyaFieldGuideTitle: 'Wildlife Field Guide',
    kenyaFieldGuideSubtitle: 'Maasai Mara Explorer Notebook',
    kenyaEntryCompleteLabel: 'Discovered',
    kenyaFieldGuideLockedHint: 'Explore this safari spot and answer the discovery question to unlock this page.',
    kenyaObjectiveTalkAminaBuild: 'Talk to Amina: Safari Fact Builder',
    kenyaObjectiveBuild: 'Safari Fact Builder',
    kenyaBuildCountLabel: 'Safari Facts',
    kenyaStartBuildButton: 'Start Building',
    kenyaReturnAminaBuildHint: 'Return to Ranger Amina at Safari Ranger Camp to start Safari Fact Builder!',
    kenyaBuildCelebrationTitle: 'Safari Fact Builder Complete!',
    kenyaBuildCelebrationSubtitle: '+50 XP earned! All 5 Wildlife Information Boards are ready.',
    kenyaPracticeUnlockedBadge: 'PRACTICE Stage Unlocked',
    kenyaPracticeSoonNote: 'Stage 3: PRACTICE arrives in Phase 2D!',
    kenyaBoardStationBadge: 'Safari Research Board',
    kenyaBuildStepStudyBuild: '1. Study & Build',
    kenyaBuildStepSpeak: '2. Speak Fact',
    kenyaBuildStepSaved: '3. Saved',
    kenyaBuildLevelA2: 'A2 Guided',
    kenyaBuildLevelB1: 'B1 Challenge',
    kenyaBuildModelLabel: 'Model Sentence',
    kenyaBuildShowHint: 'Show Hint',
    kenyaBuildHideHint: 'Hide Hint',
    kenyaBuildHintXpSafe: 'Hints never deduct XP',
    kenyaBuildClearSlots: 'Clear Board',
    kenyaBuildCheckButton: 'Check Sentence',
    kenyaBuildPreviewLabel: 'Your Information Board Sentence',
    kenyaBuildCheckComplete: 'Complete',
    kenyaBuildCheckGrammar: 'Grammar',
    kenyaBuildCheckFactual: 'Fact Check',
    kenyaBuildGoSpeakButton: 'Practice Speaking This Fact',
    kenyaBuildSpeakHeading: 'Speak Your Safari Fact Aloud',
    kenyaBuildSpeakNote: 'Listen to the voice guide, read your sentence aloud clearly, or record a quick self-check.',
    kenyaBuildSaveButton: 'Save to Field Guide',
    kenyaBuildAlreadySavedNote: 'Saved in Field Guide — rebuild or practice speaking anytime!',
    kenyaBuildCompleteInlineNote: '5/5 Boards Ready! +50 XP & PRACTICE Stage Unlocked!',
    kenyaFieldGuideSentencesHeading: 'My Safari Sentences',
    kenyaFieldGuideSentenceBuiltBadge: 'Sentence Built',
    kenyaFieldGuideSentencePending: 'Visit this station in Safari Fact Builder to craft and save your own English sentence.',
    kenyaFieldGuideBuiltSummary: 'Sentences',
    kenyaObjectiveTalkAminaPractice: 'Talk to Amina: WildSpeak Safari Tour',
    kenyaObjectivePractice: 'WildSpeak Safari Tour',
    kenyaPracticeCountLabel: 'Safari Conversations',
    kenyaStartPracticeButton: 'Start Safari Tour',
    kenyaReturnAminaPracticeHint: 'Return to Ranger Amina at Safari Ranger Camp to start WildSpeak Safari Tour!',
    kenyaPracticeCelebrationTitle: 'WildSpeak Safari Tour Complete!',
    kenyaPracticeCelebrationSubtitle: '+50 XP earned! You answered all 5 tourist questions in English.',
    kenyaPerformUnlockedBadge: 'PERFORM Stage Unlocked',
    kenyaPerformSoonNote: 'Stage 4: PERFORM arrives in the next update!',
    kenyaPracticeStepListen: '1. Listen',
    kenyaPracticeStepPrepare: '2. Prepare',
    kenyaPracticeStepSpeak: '3. Speak',
    kenyaPracticeStepReview: '4. Review',
    kenyaPracticeStepDone: '5. Complete',
    kenyaPracticeModeGuided: 'Guided',
    kenyaPracticeModeSupported: 'Supported',
    kenyaPracticeModeIndependent: 'Independent',
    kenyaPracticeIndependentEncourage: 'Final guide challenge — try Independent mode first (help is always free)!',
    kenyaPracticeReplayQuestion: 'Replay Question',
    kenyaPracticeQuestionTargetLabel: 'Speaking Goal',
    kenyaPracticeSavedSentenceLabel: 'Your Built Sentence',
    kenyaPracticeStarterLabel: 'Helpful Starter',
    kenyaPracticeModelLabel: 'Model Example',
    kenyaPracticeListenModel: 'Listen to Model',
    kenyaPracticeRevealModel: 'Reveal Model Example',
    kenyaPracticeHideModel: 'Hide Model Example',
    kenyaPracticeHelpShow: 'Show Help & Vocab',
    kenyaPracticeHelpHide: 'Hide Help & Vocab',
    kenyaPracticeHelpXpSafe: 'Help is always free — zero XP penalty',
    kenyaPracticeSpeakingPromptNote: 'Respond aloud in your own words to help your safari visitor.',
    kenyaPracticeNoMicAloudCheck: 'I practiced speaking my answer clearly aloud.',
    kenyaPracticeChecklistHeading: 'Self-Reflection Checklist',
    kenyaPracticeChecklistHint: 'Tick at least one statement that matches your answer before completing.',
    kenyaPracticeCheckAnswered: 'I answered the visitor’s question directly.',
    kenyaPracticeCheckFact: 'I included an accurate Maasai Mara wildlife or habitat fact.',
    kenyaPracticeCheckClear: 'I spoke clearly with steady pacing.',
    kenyaPracticeCheckConnector: 'I used helpful words from the Field Guide or connectors like "because" / "to" / "should".',
    kenyaPracticeFeedbackHeading: 'Self-Reflection & Practice Guidance',
    kenyaPracticeFeedbackHonestBadge: 'Practice Guidance · Audio stays private on this device',
    kenyaPracticeCompleteButton: 'Complete Conversation',
    kenyaPracticeDoneHeading: 'Conversation Complete!',
    kenyaPracticeAlreadyDoneNote: 'Already practiced — rehearse again anytime to build fluency!',
    kenyaPracticeContinueTour: 'Continue Safari Tour',
    kenyaObjectiveTalkAminaPerform: 'Talk to Amina: Final Challenge',
    kenyaObjectivePerformReady: 'Conservation Lookout: Deliver Speech',
    kenyaObjectiveMissionComplete: 'Kenya Complete · Passport Stamp Earned',
    kenyaStartFinalChallengeButton: 'Start Final Challenge',
    kenyaReplayFinalChallengeButton: 'Replay Ambassador Stage',
    kenyaReplaySafariTourButton: 'Replay Safari Tour',
    kenyaOpenStagePrompt: 'Ambassador Stage',
    kenyaPerformMissionBadge: 'Save the Savanna · Stage 4 PERFORM',
    kenyaPerformTitle: 'Final Wildlife Ambassador Challenge',
    kenyaPerformTargetDuration: 'Suggested: 60–90 seconds · Own words',
    kenyaPerformStepBriefing: '1. Briefing',
    kenyaPerformStepPrepare: '2. Prepare',
    kenyaPerformStepSpeech: '3. Speech',
    kenyaPerformStepQa: '4. Q&A',
    kenyaPerformStepReflect: '5. Stamp',
    kenyaPerformGoalsHeading: 'Your 5 Wildlife Ambassador Goals',
    kenyaPerformBriefIntro: 'Step onto the Conservation Lookout outdoor stage with Ranger Amina, Emma, and Daniel. Inform your audience about Maasai Mara wildlife and persuade visitors to help protect the savanna!',
    kenyaPerformGoPrepareButton: 'Prepare Your Speech',
    kenyaPerformPrepFactsHeading: 'Choose at least 2 Wildlife Facts',
    kenyaPerformPrepFactsHint: 'Pulled from your Field Guide and Safari Fact Builder sentences',
    kenyaPerformPrepReasonsHeading: 'Choose at least 1 Reason Why Protection Matters',
    kenyaPerformPrepActionsHeading: 'Choose at least 1 Persuasive Conservation Action',
    kenyaPerformCueCardHeading: 'Your Speaking Cue Cards',
    kenyaPerformCustomNoteLabel: 'Add your own greeting or personal message (optional)',
    kenyaPerformCustomNotePlaceholder: 'e.g., Let us keep the savanna wild and welcoming for every herd!',
    kenyaPerformScaffoldShow: 'Show Help & Model',
    kenyaPerformScaffoldHide: 'Hide Scaffolding',
    kenyaPerformScaffoldHiddenNote: 'Scaffolding hidden — deliver the speech naturally in your own words!',
    kenyaPerformModelSpeechHeading: 'Optional 60–90s Model Ambassador Speech',
    kenyaPerformStartersHeading: 'Helpful Speaking Starters',
    kenyaPerformVocabHeading: 'Field Guide Key Vocabulary',
    kenyaPerformFromBuildTag: 'Your BUILD sentence',
    kenyaPerformStepOntoStageButton: 'Step Onto Stage',
    kenyaPerformStageHint: 'Introduce the Maasai Mara, share 2+ wildlife facts, explain why protection matters, and recommend 1+ conservation action.',
    kenyaPerformCueCardsToggle: 'Cue Cards',
    kenyaPerformHearOpeningButton: 'Hear Model Speech',
    kenyaPerformTimerSuggestedLabel: 'Suggested 60–90s',
    kenyaPerformTimerSweetSpotNote: 'Great length! Keep going until you finish naturally.',
    kenyaPerformNoMicAloudCheck: 'I delivered my full Wildlife Ambassador speech aloud using my cue cards.',
    kenyaPerformGoQaButton: 'Start Tourist Q&A (2 Questions)',
    kenyaPerformQaHeading: 'Live Tourist Q&A · Emma & Daniel',
    kenyaPerformQaIntro: 'Listen to both questions from your safari guests and reply aloud in English.',
    kenyaPerformQaNoMicCheck: 'I answered this visitor question aloud clearly in English.',
    kenyaPerformQaAnsweredBadge: 'Answered',
    kenyaPerformGoReflectButton: 'Review & Reflect',
    kenyaPerformReflectHeading: 'Wildlife Ambassador Self-Reflection',
    kenyaPerformReflectDisclaimer: 'Honest self-reflection only — no automatic AI transcript or pronunciation score is used. Listen back to your recordings and reflect on each speaking goal.',
    kenyaPerformReflectPrompt: 'Reflect honestly on all 6 ambassador communication skills:',
    kenyaPerformReflectSpeechAudioLabel: 'Main Speech',
    kenyaPerformRubricStrongLabel: 'Confident',
    kenyaPerformRubricPracticeLabel: 'Practice Next',
    kenyaPerformFinishButton: 'Finish & Claim Kenya Stamp',
    kenyaPerformReplayFinishButton: 'Finish Practice Encore',
    kenyaPerformCeremonyBadge: 'Kenya Adventure Complete!',
    kenyaPerformCeremonyTitle: 'Kenya Passport Stamp Earned!',
    kenyaPerformCeremonySubtitle: 'Ranger Amina, Emma, and Daniel applaud your Wildlife Ambassador speech!',
    kenyaPerformCeremonyReplaySubtitle: 'Another inspiring Wildlife Ambassador speech! Your Kenya Stamp remains saved in your Passport.',
    kenyaPerformAmbassadorTitle: 'Wildlife Ambassador',
    kenyaPerformTotalXpNote: 'Kenya Safari 4-Stage Total',
    kenyaPerformCumulativeXpNote: 'Explorer Total with India',
    kenyaPerformStayKenyaButton: 'Return to Maasai Mara',
    kenyaPerformViewPassportButton: 'View Passport',
    worldMapCompletedBadge: 'Completed',
    worldMapStatusAvailable: 'Available',
    worldMapStatusInProgress: 'In Progress',
    worldMapStatusLocked: 'Locked',
    worldMapStatusComingSoon: 'Coming Soon',
    worldMapScotlandUnlockHint: 'Complete Kenya — WildSpeak Safari to unlock Scotland.',
    worldMapComingSoonHint: 'Future VoxVoyage destination — coming in a later chapter.',
    worldMapEgyptUnlockedBadge: 'Unlocked · Coming Soon',
    worldMapEgyptUnlockedHint: 'Egypt Expedition unlocked! Full 3D Egypt adventure arrives in a future chapter.',
    worldMapComingSoonButton: 'Coming Soon',
    worldMapLockedButton: 'Complete Kenya First',
    arrivingScotlandTitle: 'Arriving in the Scottish Highlands',
    arrivingScotlandSubtitle: 'Highland Heroes · Scotland',
    scotlandHudTitle: 'Highland Heroes',
    scotlandHudSubtitle: 'Explore Scotland',
    scotlandBackToHighlands: 'Return to Scotland',
    scotlandFallback2dNotice: '2D Accessible Mode — Walk or tap Eilidh, Fiona, and all 5 Highland landmarks.',
    scotlandExploredCountLabel: 'Explored',
    scotlandObjectiveExplore: 'Meet Eilidh & explore 5 Highland landmarks',
    scotlandObjectiveDone: 'Highland Village Explored · Stage 1 Coming Soon',
    scotlandSpeakWithPrefix: 'Talk to',
    scotlandExploreSpotPrefix: 'Explore',
    scotlandContinueButton: 'Continue',
    scotlandCloseButton: 'Close',
    scotlandCulturalFocusLabel: 'Cultural Theme',
    scotlandEverydayVsTraditionLabel: 'Tradition & Everyday Life',
    scotlandComparePromptLabel: 'Thailand Comparison Spark',
    scotlandMarkExploredButton: 'Save Visit to Explorer Log',
    scotlandAlreadyExploredLabel: 'Explored in World',
    scotlandExplorationNote: 'Open exploration — no scores, quizzes, or stamps in this preview chapter.',
    scotlandDiscoverStageBadge: 'Stage 1 · DISCOVER',
    scotlandStartCultureQuestButton: 'Start Scottish Culture Quest',
    scotlandOpenJournalButton: 'Explorer Journal',
    scotlandEvidenceHudLabel: 'Cultural Evidence',
    scotlandObjectiveTalkEilidhStart: 'Talk to Eilidh to start Scottish Culture Quest',
    scotlandObjectiveCollectEvidence: 'Collect 5 Cultural Evidence cards across Highland stations',
    scotlandObjectiveDiscoverComplete: 'DISCOVER Complete · BUILD Stage Next',
    scotlandDiscoverBannerTitle: 'DISCOVER Complete · +50 XP!',
    scotlandDiscoverBannerSubtitle: 'All 5 Cultural Evidence cards saved! Stage 2: BUILD unlocks in the next chapter.',
    scotlandStartQuestPromptNote: 'Speak with Eilidh first to begin collecting Cultural Evidence.',
    scotlandInspectionBeforeQuestNote: 'Talk to Eilidh and choose "Start Scottish Culture Quest" to unlock this station activity.',
    scotlandLaunchChallengeButton: 'Open Cultural Activity',
    scotlandJournalTitle: 'Scottish Cultural Explorer Journal',
    scotlandJournalSubtitle: 'Scotland–Thailand Exhibition Evidence',
    scotlandJournalLockedCardHint: 'Visit this Highland landmark during Scottish Culture Quest and finish its discovery activity to record evidence here.',
    scotlandJournalFactLabel: 'Scottish Cultural Fact',
    scotlandJournalVocabLabel: 'Key Cultural Vocabulary',
    scotlandJournalThaiLinkLabel: 'Thailand Connection',
    scotlandJournalCompareLabel: 'Compare & Contrast Notes',
    scotlandSimilarityShortLabel: 'Similarity',
    scotlandDifferenceShortLabel: 'Difference',
    scotlandLanguageBridgeLabel: 'Language Bridges',
    scotlandJournalCompleteNote: 'All 5 cultural evidence cards collected!',
    scotlandJournalProgressNote: 'Collect evidence at every Highland landmark to prepare for BUILD Stage.',
    scotlandScaffoldModeLabel: 'Scaffolding Level',
    scotlandModeA2Label: 'A2 Guided',
    scotlandModeB1Label: 'B1 Challenge',
    scotlandHintButton: 'Hint',
    scotlandStationSavedTitle: 'Cultural Evidence Recorded!',
    scotlandStationFirstSaveNote: 'Saved in your Scottish Cultural Explorer Journal. Collect all 5 stations for +50 XP!',
    scotlandStationReplayNote: 'Already saved in your Journal — replay anytime for practice (+0 extra XP).',
    scotlandReplayActivityButton: 'Play Again',
    scotlandContinueExploringButton: 'Continue Exploring',
    scotlandReadLandmarkNoteButton: 'View Landmark Overview',
    scotlandStation1Instruction: 'Select each Highland Village clue and classify what it shows.',
    scotlandClassifyPrompt: 'Classify this evidence:',
    scotlandStation2Instruction: 'Pair each textile or garment card with its accurate cultural role.',
    scotlandMatchPurposePrompt: 'Choose the matching purpose or origin:',
    scotlandFinalInsightLabel: 'Cultural Connection Check',
    scotlandCountryLabel: 'Scotland',
    scotlandBothCountriesLabel: 'Both',
    scotlandThailandLabel: 'Thailand',
    scotlandStation3Instruction: 'Inspect each Scottish dish tray, reveal its ingredients, and connect to Thai cuisine.',
    scotlandInspectIngredientsButton: 'Inspect Ingredients',
    scotlandFoodComparePrompt: 'Connect this dish to Thailand:',
    scotlandStation4Instruction: 'Play each synthesized instrument sound, watch the rhythm pulse, and identify its festival role.',
    scotlandPlaySoundCueButton: 'Play Instrument Cue',
    scotlandIdentifyRolePrompt: 'How does this instrument support the festival?',
    scotlandStation5Instruction: 'Sort each cultural observation onto the Scotland, Both, or Thailand compass zone.',
    scotlandPlaceCompassZonePrompt: 'Place on Comparison Compass:',
    scotlandLanguageBridgePreviewTitle: 'Preview Comparison Bridges (Ready for Stage 2 BUILD)',
    scotlandRouteTabLabel: 'Recommended Route',
    scotlandEvidenceTabLabel: 'Evidence Cards',
    scotlandRecommendedNextLabel: 'Recommended Next',
    scotlandGuideMeButton: 'Guide Me',
    scotlandGuidingActiveLabel: 'Guiding Beacon',
    scotlandClearGuideButton: 'Clear Guide',
    scotlandStatusCompleted: 'Completed',
    scotlandStatusVisited: 'Visited',
    scotlandStatusNotVisited: 'Not Visited',
    scotlandHudGuidingPrefix: 'Guide',
    scotlandAllStationsDoneNote: 'All 5 Highland stations completed! Revisit any Evidence Card anytime.',
    scotlandOpenCardButton: 'Open Evidence',
    scotlandHotspotMapTitle: 'Tap each Village Square scene hotspot, then sort it into a bucket below',
    scotlandBucketsTitle: 'Classification Buckets',
    scotlandWeaveStepTitle: 'Step 1 · Interactive Tartan Loom (Shift Warp & Weft Threads to Weave)',
    scotlandToggleWarpButton: 'Shift Vertical Warp',
    scotlandToggleWeftButton: 'Shift Horizontal Weft',
    scotlandWeaveCompareContinue: 'Tartan Woven — Open Textile Match Board',
    scotlandPairLeftTitle: '1. Select Textile Card',
    scotlandPairRightTitle: '2. Tap Matching Cultural Role',
    scotlandPantryShelfTitle: '1. Market Pantry Shelf — Pick the 3 Authentic Scottish Ingredients',
    scotlandMixingBowlTitle: '2. Dish Mixing Bowl',
    scotlandBowlReadyNote: 'All 3 Scottish ingredients gathered! Now connect this dish to Thailand:',
    scotlandMysteryAudioPrompt: 'Listen to the Mystery Audio Clue & Watch the Rhythm Pulse',
    scotlandCompassTrayTitle: '1. Select an Unsorted Cultural Observation Card',
    scotlandCompassBoardHint: 'Placed on comparison board',
    replayCountryButton: 'Replay Country',
    restartAttemptButton: 'Restart Current Attempt',
    replayModeLabel: 'Practice Replay',
    replayAttemptPrefix: 'Attempt',
    replayStagePrefix: 'Stage',
    replayAttemptCompleteLabel: 'Attempt Complete',
    replayConfirmTitle: 'Replay Country from DISCOVER?',
    restartConfirmTitle: 'Restart Current Attempt?',
    replayConfirmBody: 'Start a fresh practice attempt for this country beginning at Stage 1 (DISCOVER). You can progress through its implemented stages again without risking any earned rewards.',
    restartConfirmBody: 'Reset only your active replay attempt back to Stage 1 (DISCOVER). Previously completed attempts and all earned rewards stay untouched.',
    replayPreservedTitle: 'Safely Preserved',
    replayPreservedDetail: 'Your total XP, Coins, Gems, Passport Stamps, unlocked countries, and completed history stay 100% intact. Already-earned XP is not duplicated.',
    replayScotlandScopeNote: 'Scotland now includes all 4 stages: DISCOVER, BUILD, PRACTICE, and PERFORM — replay anytime while keeping your XP and Highland Passport Stamp safe.',
    replayConfirmActionButton: 'Start Replay from DISCOVER',
    restartConfirmActionButton: 'Restart Attempt',
    cancelButton: 'Cancel',
    replayNoExtraXpLabel: 'Practice Replay · XP Preserved',
    scotlandDiscoverReplayBannerTitle: 'DISCOVER Replay Complete!',
    scotlandBuildStageBadge: 'Stage 2 · BUILD',
    scotlandObjectiveTalkEilidhBuild: 'Talk to Eilidh to start Stage 2: BUILD',
    scotlandObjectiveBuild: 'Craft 5 Scotland–Thailand comparisons',
    scotlandObjectiveBuildComplete: 'BUILD Complete · PRACTICE Stage unlocked!',
    scotlandBuildHudLabel: 'Built',
    scotlandStartBuildButton: 'Start BUILD — Comparison Crafting',
    scotlandBuildBannerTitle: 'Stage 2 Complete! +50 XP Earned',
    scotlandBuildReplayBannerTitle: 'BUILD Replay Complete!',
    scotlandBuildBannerSubtitle: 'All 5 Scotland–Thailand comparisons forged. Stage 3: PRACTICE is now unlocked!',
    scotlandBuildSavedTitle: 'Comparison Crafted & Saved!',
    scotlandBuildFirstSaveNote: 'Saved for PRACTICE Stage. Complete all 5 BUILD challenges for +50 XP!',
    scotlandBuildReplayNote: 'Comparison updated! Replay anytime for practice (+0 extra XP).',
    scotlandBuildCraftedLabel: 'Crafted Comparison Statement',
    scotlandBuildInspectDiscoverCardButton: 'Review DISCOVER Station',
    scotlandBuildPracticeReadinessNote: 'Craft comparisons at all 5 Highland stations to unlock Stage 3: PRACTICE.',
    scotlandBuildSubmitButton: 'Verify & Save Comparison',
    scotlandBuildClearTilesButton: 'Clear Tiles',
    scotlandBuildTrySpeakLabel: 'Listen & Practice Speaking (Optional)',
    scotlandBuildCheckSpeakingButton: 'Speak Sentence',
    scotlandBuildStopListeningButton: 'Stop Mic',
    scotlandBuildNoSpeechNote: 'Speech check is optional — listen with audio and continue freely.',
    scotlandJournalBuiltSentenceLabel: 'Stage 2 BUILD Comparison',
    scotlandPracticeStageBadge: 'Stage 3 · PRACTICE',
    scotlandPracticeHudLabel: 'Conversations',
    scotlandObjectiveTalkEilidhPractice: 'Talk to Eilidh to start Stage 3: PRACTICE',
    scotlandObjectivePractice: 'Complete 5 Highland cultural conversations',
    scotlandObjectivePerformUnlocked: 'PRACTICE Complete · PERFORM Stage unlocked!',
    scotlandStartPracticeButton: 'Start PRACTICE — Highland Cultural Conversations',
    scotlandPracticeBannerTitle: 'Stage 3 Complete! +50 XP Earned',
    scotlandPracticeReplayBannerTitle: 'PRACTICE Replay Complete!',
    scotlandPracticeBannerSubtitle: 'All 5 Highland cultural conversations completed. Stage 4: PERFORM is now unlocked!',
    scotlandPracticeReviewBuildButton: 'Review BUILD Station',
    scotlandPracticeDoneBadge: 'PRACTICE Done',
    scotlandPracticeStepListen: '1. Listen',
    scotlandPracticeStepPrepare: '2. Prepare',
    scotlandPracticeStepSpeak: '3. Speak',
    scotlandPracticeStepReview: '4. Review',
    scotlandPracticeStepComplete: '5. Complete',
    scotlandPracticeStopAudioButton: 'Stop Audio',
    scotlandPracticeListenPromptButton: 'Hear Question',
    scotlandPracticeSpeakPromptNote: 'Respond aloud in your own words using real Scottish & Thai details.',
    scotlandPracticeEvidenceLinkHeading: 'From Your Cultural Explorer Journal (Stage 1)',
    scotlandPracticeBuildLinkHeading: 'Your Saved Comparison Sentence (Stage 2 BUILD)',
    scotlandPracticeOtherBuiltHeading: 'Other Saved BUILD Sentences (for Synthesis)',
    scotlandPracticeKeyTermsHeading: 'Key Vocabulary & Comparison Connectors',
    scotlandPracticeFramesHeading: 'Optional Sentence Frames',
    scotlandPracticeModelHeading: 'Model Comparison Example',
    scotlandPracticeHideFramesLabel: 'Hide Scaffolding',
    scotlandPracticeShowFramesLabel: 'Show Scaffolding',
    scotlandPracticeFollowUpBadge: 'Fiona’s Follow-Up Question',
    scotlandPracticeFollowUpInstruction: 'After your main exchange with Eilidh, record or practice aloud a quick response to Fiona’s follow-up:',
    scotlandPracticeFollowUpNoMicCheck: 'I practiced answering Fiona’s follow-up question aloud',
    scotlandPracticeFollowUpRequiredNote: 'Record or check aloud practice for Fiona’s follow-up prompt above before continuing.',
    scotlandPracticeCheckCompare: 'I compared Scotland and Thailand.',
    scotlandPracticeCheckExample: 'I used a specific example.',
    scotlandPracticeCheckSimDiff: 'I explained a similarity or difference.',
    scotlandPracticeCheckClear: 'I tried to speak clearly.',
    scotlandPracticeChecklistHint: 'Tick what describes your speaking practice (check at least 1):',
    scotlandPracticeGuidanceHeading: 'Practice Guidance',
    scotlandPracticeGuidanceHonestNote: 'Structured self-reflection coach — no automated AI transcripts or scores. Recordings stay temporarily on this device only.',
    scotlandPracticeListenModelButton: 'Listen to Model',
    scotlandPracticeSaveCompleteButton: 'Save & Complete Conversation',
    scotlandPracticeReturnWorldButton: 'Continue Highland Tour',
    scotlandPracticeNoMicIntro: 'Microphone unavailable or switched to no-mic mode — practice your spoken comparison aloud, then confirm below.',
    scotlandPracticeNoMicAloudCheck: 'I Practiced Aloud — I spoke my comparison response clearly',
    scotlandPracticeAllFiveEarnedNote: 'All 5 Highland cultural conversations finished! Stage 4: PERFORM is now unlocked.',
    scotlandPerformStageBadge: 'Stage 4 · PERFORM',
    scotlandObjectiveStartPerform: 'Talk to Eilidh or visit Lochside Castle Viewpoint to start PERFORM',
    scotlandObjectivePerformShowcase: 'Present your Cultural Exchange speech at Lochside Castle Viewpoint',
    scotlandObjectiveScotlandComplete: 'Highland Heroes Complete! Passport Stamp Earned',
    scotlandPerformHudReady: 'Ready at Lochside',
    scotlandPerformHudDone: 'Ambassador ✓',
    scotlandStartPerformButton: 'Start PERFORM — Final Cultural Exchange Challenge',
    scotlandGoLochsideShowcaseButton: 'Open Cultural Exchange Showcase',
    scotlandPerformBannerTitle: 'Scotland Complete! +100 XP & Stamp Earned',
    scotlandPerformReplayBannerTitle: 'PERFORM Replay Complete!',
    scotlandPerformBannerSubtitle: 'Scottish Highlands Passport Stamp unlocked! You are a Scotland–Thailand Cultural Ambassador.',
    scotlandPerformTitle: 'Final Cultural Exchange Challenge',
    scotlandPerformMissionBadge: 'Stage 4 · PERFORM · A2–B1',
    scotlandPerformTargetDuration: '60–90s suggested',
    scotlandPerformLocationLabel: 'Lochside Castle Viewpoint',
    scotlandPerformStepInvitation: 'Invitation',
    scotlandPerformStepPrepare: 'Prepare',
    scotlandPerformStepSpeech: 'Deliver',
    scotlandPerformStepQa: 'Q&A',
    scotlandPerformStepReflect: 'Reflect',
    scotlandPerformInvitationHeading: 'Welcome to the Lochside Cultural Exchange',
    scotlandPerformExpectationsHeading: 'Your Ambassador Showcase Checklist',
    scotlandPerformListenInstructions: 'Listen to Instructions',
    scotlandPerformShowThaiSupport: 'Show Thai Support',
    scotlandPerformHideThaiSupport: 'Hide Thai Support',
    scotlandPerformStartPrepButton: 'Start Preparation',
    scotlandPerformEvidenceHeading: '1. Select Your Cultural Evidence (Pick at least 2)',
    scotlandPerformEvidenceHint: 'Choose at least 2 Highland evidence categories from your journey. Your saved BUILD comparisons are preloaded below for reference.',
    scotlandPerformEvidenceCountLabel: 'selected',
    scotlandPerformYourBuildQuoteLabel: 'Your Stage 2 BUILD Sentence',
    scotlandPerformPlannerHeading: '2. Build Your Own Comparison Outline (5 Short Notes)',
    scotlandPerformPlannerHint: 'Write short speaking notes in your own words — use the optional starters only if helpful.',
    scotlandPerformInsertStarterButton: 'Add Starter',
    scotlandPerformConnectorsHeading: 'Compare & Contrast Connectors Review',
    scotlandPerformShowSampleButton: 'View Sample Reference (Optional)',
    scotlandPerformHideSampleButton: 'Hide Sample Reference',
    scotlandPerformGoSpeechButton: 'Continue to Stage',
    scotlandPerformSpeechHeading: 'Deliver Your Cultural Exchange Speech',
    scotlandPerformSpeechSubtitle: 'Speak warmly to Eilidh, Fiona, and your host audience in your own words.',
    scotlandPerformTimerGuidanceLabel: 'Suggested pace: 60–90s (flexible — take all the time you need)',
    scotlandPerformToggleNotesButton: 'Outline Notes',
    scotlandPerformNoMicAloudCheck: 'I delivered my cultural comparison aloud.',
    scotlandPerformGoQaButton: 'Continue to Cultural Q&A',
    scotlandPerformQaHeading: 'Live Audience Cultural Q&A (2 Questions)',
    scotlandPerformQaIntro: 'Listen to each question from Eilidh and Fiona, then record or speak your own thoughtful response aloud.',
    scotlandPerformQaDoneBadge: 'Answered',
    scotlandPerformQaNoMicCheck: 'I answered this audience question aloud.',
    scotlandPerformGoReflectButton: 'Review & Reflect',
    scotlandPerformReflectHeading: 'Self-Reflection & Replay',
    scotlandPerformReflectAudioHeading: 'Listen Back to Your Showcase (Temporary Device Audio)',
    scotlandPerformReflectChecklistPrompt: 'Honestly check the goals you completed during your showcase (pick all that apply):',
    scotlandPerformReflectGuidanceTitle: 'Self-Reflection & Practice Guidance',
    scotlandPerformReflectDisclaimer: 'Honest self-reflection guide — no automated AI speech scores or hidden grading. Mic audio stays temporarily on your device and is cleared when you close.',
    scotlandPerformFinishButton: 'Complete Challenge & Earn Passport Stamp',
    scotlandPerformReplayFinishButton: 'Finish Replay Showcase',
    scotlandPerformCeremonyBadge: 'Scotland–Thailand Cultural Exchange Complete',
    scotlandPerformCeremonyTitle: 'Highland Heroes Stamp Unlocked!',
    scotlandPerformAmbassadorTitle: 'Scotland–Thailand Cultural Ambassador',
    scotlandPerformCeremonySubtitle: 'You earned +100 XP (250 XP total for Scotland) and unlocked the Scottish Highlands Passport Stamp!',
    scotlandPerformCeremonyReplaySubtitle: 'Practice replay completed! Your 750 XP, passport stamps, and completion records stay safely preserved.',
    scotlandPerformTotalXpNote: 'Scotland Journey Total',
    scotlandPerformCumulativeXpNote: 'Cumulative World XP',
    scotlandPerformStayScotlandButton: 'Explore Highlands',
    scotlandPerformViewPassportButton: 'View Passport',
    scotlandPerformReplayButton: 'Replay Scotland',
    scotlandLochsideInviteBadge: 'Final Cultural Exchange Ready',
    scotlandLochsideReviewPracticeButton: 'Review Stage 3 PRACTICE',
    worldMapAustraliaUnlockHint: 'Complete Scotland (Highland Heroes) and earn the Scotland Passport Stamp to unlock Australia.',
    australiaBackToSydney: 'Back to Sydney Harbour',
    arrivingAustraliaTitle: 'Arriving in Sydney Harbour',
    arrivingAustraliaSubtitle: 'CityTalk Quest · World 4 Exploration Foundation',
    australiaExploreStageBadge: 'Stage 1 · DISCOVER',
    australiaObjectiveExplore: 'Talk to Olivia Parker to launch the 5-mission CityTalk Discovery Quest',
    australiaObjectiveMeetAllNpcs: 'Complete DISCOVER Missions 1–5 across Sydney Harbour in sequence',
    australiaObjectiveReadyNextPhase: 'All 5 DISCOVER missions complete (+50 XP)! BUILD Unlocked — Coming in Phase 4C.',
    australiaControlsHint: 'Walk: WASD / Arrows · Look: Drag / Q & E · Interact: E or Tap · Guide: City Explorer Guide',
    australiaFallback2dNotice: 'Using accessible 2D Sydney Harbour District Map (same landmarks, NPCs, and routes).',
    australiaCityGuideButton: 'City Explorer Guide',
    australiaCityGuideTitle: 'Sydney City Explorer Guide',
    australiaCityGuideSubtitle: '5 Waterfront Districts · TO INTERACT (A2–B1)',
    australiaCityGuideTabRoute: 'Recommended Route',
    australiaCityGuideTabDistricts: 'District Details',
    australiaCityGuideRouteTitle: 'CityTalk Discovery Route & Mission Progress',
    australiaCityGuideRouteDesc: 'Explore all 5 districts freely anytime. Communication Discovery Missions 1–5 unlock in sequence; Guide Me lights up any stop in the world.',
    australiaCityGuideNextStopBadge: 'Recommended Next',
    australiaCityGuideAllVisitedNote: 'You have explored all 5 Sydney Harbour landmarks! Check your DISCOVER mission progress below.',
    australiaCityGuideVisitedBadge: 'Visited',
    australiaCityGuideNotVisitedBadge: 'Not Visited',
    australiaCityGuideGuideMeButton: 'Guide Me',
    australiaCityGuideGuidingActiveButton: 'Guiding Active',
    australiaCityGuideStopGuideButton: 'Clear Guide',
    australiaCityGuideLanguageFocusLabel: 'Communication Focus (TO INTERACT)',
    australiaCityGuideCulturalNoteLabel: 'Everyday Sydney Culture',
    australiaCityGuidePhaseNote: 'Stage 1 DISCOVER awards +50 XP once after Mission 5. Stage 2 BUILD, PRACTICE & PERFORM unlock in Phases 4C–4E (Australia Stamp locked).',
    australiaListenDialogue: 'Listen',
    australiaNextTipButton: 'Explore Tip',
    australiaCloseDialogButton: 'Continue Exploring',
    australiaPauseTitle: 'Sydney Harbour Paused',
    australiaPauseSubtitle: 'CityTalk Quest · World 4 DISCOVER',
    australiaResumeButton: 'Resume Exploring',
    australiaLandmarkPreviewBadge: 'Sydney Harbour Landmark',
    australiaLandmarkPhase4BNote: 'Exploration saved (+0 XP per landmark; completing all 5 sequential DISCOVER missions awards +50 XP once).',
    australiaDiscoverStartButton: 'Begin CityTalk Discovery Quest',
    australiaDiscoverStartedToast: 'CityTalk Discovery Quest started! Head into Mission 1 at Circular Quay.',
    australiaDiscoverPlayMissionButton: 'Play DISCOVER Mission',
    australiaDiscoverReviewMissionButton: 'Review Completed Mission',
    australiaDiscoverCompletedBadge: 'Mission Complete',
    australiaDiscoverPlayableBadge: 'Playable Next',
    australiaDiscoverLockedNeedOlivia: 'Speak with Olivia Parker first to begin the CityTalk Discovery Quest.',
    australiaDiscoverLockedPrevious: 'Complete the previous DISCOVER mission first to unlock this challenge:',
    australiaDiscoverBuildUnlockedTitle: 'Stage 2 BUILD Unlocked',
    australiaDiscoverBuildUnlockedNote: 'Unlocked — Coming in Phase 4C! Australia Passport Stamp remains locked until Stage 4 PERFORM.',
    australiaDiscoverStageCompleteReward: '+50 XP Earned · Stage 1 DISCOVER Complete!',
    australiaDiscoverCefrA2Label: 'A2 Core',
    australiaDiscoverCefrB1Label: 'B1 Nuance',
    australiaDiscoverHearButton: 'Hear Expression',
    australiaDiscoverReplayAudioButton: 'Replay',
    australiaDiscoverStopAudioButton: 'Stop Audio',
    australiaDiscoverHintButton: 'Show Hint',
    australiaDiscoverHideHintButton: 'Hide Hint',
    australiaDiscoverReshuffleButton: 'New Shuffle',
    australiaDiscoverNextChallengeButton: 'Next Challenge',
    australiaDiscoverFinishMissionButton: 'Complete Mission',
    australiaDiscoverReturnSydneyButton: 'Back to Sydney Harbour',
    australiaDiscoverFictionalNotice: 'Fictional game examples for English learning only (not real Sydney fares or schedules).',
    australiaDiscoverCafeTrayTitle: 'Your Order Tray & Receipt',
    australiaDiscoverCafeMenuTitle: 'Harbour Market Practice Menu',
    australiaDiscoverBoardTabTimes: 'Session Times',
    australiaDiscoverBoardTabTickets: 'Sample Tickets',
    australiaDiscoverBoardTabInclusions: 'What Is Included',
    australiaDiscoverRepairReplyLabel: 'Live Conversation Response',
    australiaDiscoverCompletedSummaryTitle: 'Communication Secret Discovered!',
    australiaBuildStageBadge: 'STAGE 2 · BUILD',
    australiaBuildObjectiveStart: 'Talk to Olivia Parker to launch Stage 2: BUILD Conversation Builder.',
    australiaBuildObjectiveInProgress: 'Build natural Sydney conversations at all 5 BUILD landmarks in sequence.',
    australiaBuildObjectiveReadyNextPhase: 'All 5 BUILD missions complete (+50 XP)! Stage 3 PRACTICE is Coming Soon.',
    australiaBuildStartButton: 'Start Stage 2 BUILD Quest',
    australiaBuildPlayMissionButton: 'Open BUILD Workshop',
    australiaBuildReviewMissionButton: 'Replay BUILD Workshop',
    australiaBuildLockedNeedDiscover: 'Complete Stage 1 DISCOVER first to unlock BUILD.',
    australiaBuildLockedNeedOlivia: 'Talk to Olivia Parker at Circular Quay first to launch Stage 2 BUILD.',
    australiaBuildLockedPrevious: 'Complete the previous BUILD mission first:',
    australiaBuildCompletedBadge: 'Built',
    australiaBuildPlayableBadge: 'Ready to Build',
    australiaBuildPracticeUnlockedTitle: 'Stage 3: PRACTICE Unlocked (Coming Soon)',
    australiaBuildPracticeUnlockedNote: 'You earned +50 XP for completing Stage 2 BUILD! Stage 3 PRACTICE & Stage 4 PERFORM are not implemented yet.',
    australiaBuildXpRewardOnceNote: '+50 XP awarded once after all 5 Sydney BUILD workshops finish.',
    australiaBuildGuideSectionTitle: 'Stage 2 · BUILD: Interactive Conversation Builder',
    australiaBuildGuideSectionDesc: 'Assemble dialogues step-by-step across 5 different builders: 1. Sequence Forge -> 2. Direction Architect -> 3. Café Kitchen -> 4. Ticket Info Builder -> 5. Dialogue Rescue.',
    australiaBuildSavedDialogueLabel: 'Crafted Sydney Dialogue',
    australiaBuildMoveUpButton: 'Move Up',
    australiaBuildMoveDownButton: 'Move Down',
    australiaBuildRemoveCardButton: 'Remove',
    australiaBuildUndoTileButton: 'Undo Word',
    australiaBuildClearButton: 'Clear',
    australiaBuildCheckAnswerButton: 'Check Conversation',
    australiaBuildSequenceStripTitle: 'Your Conversation Order (Top to Bottom)',
    australiaBuildSequencePoolTitle: 'Shuffled Dialogue Cards (Tap to Add)',
    australiaBuildTileStripTitle: 'Your Assembled Sentence',
    australiaBuildTilePoolTitle: 'Word Tile Bank (Tap in Order)',
    australiaBuildFunctionSelectorTitle: '1. Select Communicative Function',
    australiaBuildRouteDiagramTitle: '2. Tap Matching Route Point on Diagram',
    australiaBuildCafeTurnsTitle: 'Assemble Customer Responses (3 Turns)',
    australiaBuildTicketQuestionLabel: '1. Build Question From Board Info',
    australiaBuildTicketFollowUpLabel: '2. Choose Realistic Follow-Up Response',
    australiaBuildRescueStep1Title: 'Step 1 · Identify What Went Wrong',
    australiaBuildRescueStep2Title: 'Step 2 · Build Calm Clarification Request',
    australiaBuildRescueStep3Title: 'Step 3 · Pick Respectful Follow-Up',
    australiaBuildHearFullDialogueButton: 'Hear Model Conversation',
    australiaBuildChallengeCompleteTitle: 'Conversation Crafted!',
    australiaBuildNextChallengeButton: 'Next Workshop Step',
    australiaBuildFinishMissionButton: 'Complete BUILD Mission',
    australiaBuildModeBadge: 'STAGE 2 · CONVERSATION BUILDER',
    australiaBuildReviewDiscoverToggle: 'Review Stage 1 DISCOVER',
    australiaPracticeStageBadge: 'STAGE 3 · PRACTICE',
    australiaPracticeModeBadge: 'STAGE 3 · INTERACTIVE SPEAKING PRACTICE',
    australiaPracticeObjectiveStart: 'Talk to Olivia Parker to begin Stage 3: PRACTICE speaking missions.',
    australiaPracticeObjectiveInProgress: 'Complete all 5 sequential speaking missions with Sydney NPCs.',
    australiaPracticeObjectiveReadyNextPhase: 'Stage 3 PRACTICE complete (+50 XP)! Stage 4 PERFORM unlocked (Coming Soon).',
    australiaPracticeStartButton: 'Start Stage 3: PRACTICE',
    australiaPracticePlayMissionButton: 'Practice Speaking',
    australiaPracticeReviewMissionButton: 'Review Speaking',
    australiaPracticeCompletedBadge: 'Practiced',
    australiaPracticePlayableBadge: 'Next Speaking Mission',
    australiaPracticeLockedNeedOlivia: 'Stage 3 unlocked! Talk to Olivia Parker (or click Start below) to launch PRACTICE.',
    australiaPracticeLockedPrevious: 'Complete previous speaking mission first:',
    australiaPracticePerformUnlockedTitle: 'Stage 4 Unlocked: PERFORM (Coming Soon)',
    australiaPracticePerformUnlockedNote: 'You earned +50 XP once for completing all 5 Sydney PRACTICE missions! Stage 4 PERFORM unlocks in Phase 4E.',
    australiaPracticeXpRewardOnceNote: 'Complete all 5 PRACTICE speaking missions to earn +50 XP once.',
    australiaPracticeGuideSectionTitle: 'Stage 3 · PRACTICE: Interactive Speaking Missions',
    australiaPracticeGuideSectionDesc: 'Practice 5 sequential multi-turn NPC conversations: 1. Welcome -> 2. Directions -> 3. Café -> 4. Info Hub -> 5. Help Point Repair.',
    australiaPracticeReviewBuildToggle: 'Review Stage 2 BUILD',
    australiaPracticeHelpPointReuseBadge: 'Olivia · Harbour Gardens Help Point',
    australiaPracticeEvidenceBadgeMic: 'Saved Evidence · Microphone Recording Mode',
    australiaPracticeEvidenceBadgeNoMic: 'Saved Evidence · No-Mic Rehearsal Mode',
    australiaPracticeStepListen: '1. Listen',
    australiaPracticeStepPrepare: '2. Prepare',
    australiaPracticeStepSpeak: '3. Speak',
    australiaPracticeStepReview: '4. Review',
    australiaPracticeStepComplete: '5. Complete',
    australiaPracticeListenPromptButton: 'Listen to NPC',
    australiaPracticeStopAudioButton: 'Stop Audio',
    australiaPracticeReplayTurnButton: 'Replay NPC Line',
    australiaPracticeHearClosingButton: 'Hear NPC Closing',
    australiaPracticeShowStartersButton: 'Sentence Starters',
    australiaPracticeShowModelButton: 'Model Response',
    australiaPracticeHearModelButton: 'Hear Model',
    australiaPracticeShowThaiTipButton: 'Thai Tip',
    australiaPracticeYourBuiltDialogueLabel: 'Your Crafted Line from Stage 2 BUILD',
    australiaPracticeUsefulExpressionsLabel: 'Useful Expressions to Include',
    australiaPracticeStartMicButton: 'Start Mic Recording',
    australiaPracticeStopMicButton: 'Stop Recording',
    australiaPracticeRecordingActiveLabel: 'Recording transiently in browser memory...',
    australiaPracticePlaybackButton: 'Play My Recording',
    australiaPracticeStopPlaybackButton: 'Stop Playback',
    australiaPracticeRetryRecordingButton: 'Retry This Turn',
    australiaPracticeAcceptTurnButton: 'Confirm Turn & Continue',
    australiaPracticeSwitchNoMicButton: 'Switch to No-Mic Rehearsal Mode',
    australiaPracticeSwitchMicButton: 'Try Microphone Recording Mode',
    australiaPracticeNoMicTitle: 'No-Mic Rehearsal Mode (Aloud Practice)',
    australiaPracticeNoMicNotice: 'No microphone audio is recorded in this mode. Read the situation and speak your response out loud clearly, then confirm.',
    australiaPracticeNoMicConfirmCheck: 'I spoke my response out loud for this turn.',
    australiaPracticeMicPrivacyNote: 'Recorded audio stays transiently in memory only during this turn and clears automatically on retry or close.',
    australiaPracticeMicErrorDenied: 'Microphone permission was denied. Switch to No-Mic Rehearsal Mode below to continue cleanly.',
    australiaPracticeMicErrorNotFound: 'No microphone hardware detected. Switch to No-Mic Rehearsal Mode below.',
    australiaPracticeMicErrorUnsupported: 'Live browser audio recording is unavailable here. Use No-Mic Rehearsal Mode below.',
    australiaPracticeMicErrorUnknown: 'Recording could not finish cleanly. Retry recording or use No-Mic Rehearsal Mode.',
    australiaPracticeRecordingDeferredNotice: 'Stop your active recording before changing language or A2/B1 difficulty.',
    australiaPracticeProceedPrepareButton: 'Prepare Your Responses',
    australiaPracticeProceedSpeakButton: 'Begin Speaking Role-Play',
    australiaPracticeProceedReviewButton: 'Continue to Self-Review',
    australiaPracticeBackToPrepareButton: 'Back to Prepare',
    australiaPracticeReviewTitle: 'Guided Self-Review & Speaking Checklist',
    australiaPracticeReviewDisclaimer: 'Honest Practice Record: No fake speech transcripts or automated AI pronunciation/fluency scores are generated.',
    australiaPracticeSelectAtLeastOneCheck: 'Select at least 1 speaking reflection check to finish this mission.',
    australiaPracticeCompleteMissionButton: 'Complete Speaking Mission',
    australiaPracticeCompletedTitle: 'Speaking Mission Complete!',
    australiaPracticeReplayMissionButton: 'Practice Mission Again',
    australiaPracticeReturnCityButton: 'Back to Sydney Harbour',
    australiaPracticeTurnProgressLabel: 'Turn',
    australiaPracticeNpcRepliedBadge: 'NPC Response Played',
    australiaPracticeMenuQuickRefTitle: 'Harbour Café Menu Reference',
    australiaPracticeBoardQuickRefTitle: 'Darling Harbour Visitor Board',
    australiaPerformStageBadge: 'STAGE 4 · PERFORM',
    australiaCompletedStageBadge: 'SYDNEY COMPLETE',
    australiaPerformObjectiveStart: 'Meet Olivia to start Stage 4: Final Sydney CityTalk Challenge (+100 XP & Stamp)',
    australiaPerformObjectiveInProgress: 'Complete 5 independent Sydney role-play challenges in order',
    australiaPerformObjectiveReflection: 'All 5 challenges done · Complete your Final Guided Reflection to claim +100 XP & Stamp!',
    australiaPerformObjectiveCompleted: 'Australia Complete · The Sydney Communication Ambassador (Egypt Unlocked)',
    australiaPerformStartButton: 'Start Final Sydney Challenge',
    australiaPerformPlayChallengeButton: 'Play Final Challenge',
    australiaPerformReviewChallengeButton: 'Review Challenge',
    australiaPerformStartReflectionButton: 'Final Reflection & Claim Stamp',
    australiaPerformViewCelebrationButton: 'View Celebration & Stamp',
    australiaPerformGuideSectionTitle: 'Stage 4 PERFORM — Final Sydney CityTalk Challenge',
    australiaPerformGuideSectionDesc: 'Take on 5 real-life role-plays with fewer prompts, then complete the Final Reflection for +100 XP & your Sydney Stamp.',
    australiaPerformLockedNeedOlivia: 'Talk to Olivia Parker at Circular Quay to begin Stage 4 PERFORM.',
    australiaPerformLockedPrevious: 'Complete previous Final Challenge first:',
    australiaPerformCompletedBadge: 'Challenge Completed',
    australiaPerformPlayableBadge: 'Ready for Final Challenge',
    australiaPerformMissionBadge: 'STAGE 4 PERFORM · A DAY IN SYDNEY',
    australiaPerformStepBriefing: '1. Briefing',
    australiaPerformStepInteract: '2. Interact',
    australiaPerformStepRespond: '3. Respond',
    australiaPerformStepReview: '4. Review',
    australiaPerformStepComplete: '5. Complete',
    australiaPerformBeginChallengeButton: 'Begin Interaction',
    australiaPerformProceedRespondButton: 'Your Turn to Respond',
    australiaPerformProceedReviewButton: 'Continue to Review',
    australiaPerformBackToInteractButton: 'Back to Interact',
    australiaPerformShowBuildScriptButton: 'Show My Stage 2 Script',
    australiaPerformHideBuildScriptButton: 'Hide Stage 2 Script',
    australiaPerformBuildScriptLabel: 'Saved Stage 2 Conversation Script',
    australiaPerformVocabToggleLabel: 'Useful Vocabulary',
    australiaPerformStartersToggleLabel: 'Optional Sentence Starters',
    australiaPerformStrategyToggleLabel: 'Communication Strategy',
    australiaPerformHintToggleShow: 'Need a Tip? Show Hint',
    australiaPerformHintToggleHide: 'Hide Hint',
    australiaPerformReflectionHeading: 'Final Guided Reflection — A Day in Sydney',
    australiaPerformReflectionSubtitle: 'Reflect on all 5 interactions across Sydney before claiming your Ambassador Stamp.',
    australiaPerformReflectionRequiredNote: 'Select an option for all 5 reflection prompts to finish the Final Challenge.',
    australiaPerformFinishReflectionButton: 'Complete Australia & Claim Stamp',
    australiaPerformFinishReplayButton: 'Complete Replay Challenge',
    australiaPerformSummaryTitle: 'Sydney Communication Reflection Feedback',
    australiaPerformCelebrationBadge: 'AUSTRALIA MISSION COMPLETE',
    australiaPerformAmbassadorTitle: 'The Sydney Communication Ambassador',
    australiaPerformCelebrationSubtitle: 'You mastered all 4 stages of CityTalk Quest across Sydney Harbour and unlocked your 4th Passport Stamp!',
    australiaPerformCelebrationReplaySubtitle: 'Replay attempt complete! Your lifetime XP, stamps, and Egypt unlock remain safely preserved.',
    australiaPerformTotalXpNote: 'Australia 4-Stage Total',
    australiaPerformCumulativeXpNote: 'World Explorer Cumulative',
    australiaPerformViewPassportButton: 'View Passport',
    australiaPerformReturnMapButton: 'Return to World Map',
    australiaPerformReplayCountryButton: 'Replay Australia',
    australiaPerformStaySydneyButton: 'Stay in Sydney',
    australiaPerformGoldenToastTitle: 'Australia Complete · Sydney Passport Stamp Earned!',
    australiaPerformGoldenToastBody: '+100 XP awarded · 1,000 World Explorer XP milestone · Egypt Expedition Unlocked (Coming Soon)!',
    australiaPerformReviewPromptLabel: 'Self-Evaluation Check',
    australiaPerformNoAutoAnswerNote: 'Independent PERFORM mode: full model answers stay hidden unless you request a hint tip.',
    australiaPerformReflectionGateNotice:
      'One final step! Complete your Self-Reflection to finish Australia and unlock your next destination.',
    australiaPerformCompleteReflectionButton: 'Complete Self-Reflection',
    australiaPerformResumeReflectionButton: 'Resume Self-Reflection',
    worldMapAustraliaReflectionPendingHint:
      'One final step! Complete your Self-Reflection to finish Australia and unlock your next destination.',
    navGoToNextMission: 'Go to Next Mission',
    navPlacesButton: 'Places',
    navAutoWalkButton: 'Auto-Walk',
    navQuickTravelButton: 'Quick Travel',
    navCancelWalkButton: 'Cancel',
    navClearDestinationButton: 'Clear',
    navGuideOnlyButton: 'Guide Beacon',
    navWalkingToPrefix: 'Walking to',
    navArrivedAtPrefix: 'Arrived at',
    navQuickTravelArrivedPrefix: 'Arrived via Quick Travel:',
    navAlreadyNearbyPrefix: 'You are already near',
    navCancelledManual: 'Auto-Walk paused for manual control.',
    navCancelledPrefix: 'Navigation cancelled.',
    navUnreachable: 'Cannot find a clear walkable path to this destination.',
    navComingSoonAustraliaBuild: 'Stage 2 BUILD is Coming Soon! You finished Stage 1 DISCOVER.',
    navComingSoonAustraliaPractice: 'Stage 3 PRACTICE is Coming Soon! You finished Stage 2 BUILD (+50 XP).',
    navComingSoonAustraliaPerform: 'Stage 4 PERFORM is Coming Soon! You finished Stage 3 PRACTICE (+50 XP).',
    navCountryCompletedNote: 'All missions complete in this country! Replay any spot anytime.',
    navRecommendedBadge: 'Next',
    navPlacesMenuTitle: 'Smart Navigation',
    navPlacesMenuSubtitle: 'Auto-Walk follows paths · Quick Travel teleports safely',
    navZeroRewardHint: 'Navigation shortcut · 0 XP / 0 stamps',
    navStatusCompleted: 'Completed',
    navStatusVisited: 'Visited',
    navStatusOpen: 'Open',
    navNoNextMissionNote: 'No pending mission target right now.',
    worldMapEgyptUnlockHint: 'Complete Australia — CityTalk Quest and earn the Sydney Passport Stamp to unlock Egypt.',
    worldMapEgyptEnterableBadge: 'Stage 1 · DISCOVER Active',
    worldMapEgyptEnterableHint: 'Egypt Stage 1 DISCOVER ("Secrets of the Pharaohs") is open! Complete all 5 instruction challenges for +50 XP.',
    egyptBackToGiza: 'Back to Egypt Expedition',
    arrivingEgyptTitle: 'Arriving at Giza & the Nile Camp',
    arrivingEgyptSubtitle: 'Echoes of Egypt · The Lost Secrets of the Pharaohs',
    egyptExploreStageBadge: 'Stage 1 · DISCOVER',
    egyptObjectiveExplore: 'Walk across the Nile Camp & Giza Plateau to play all 5 Stage 1 DISCOVER instruction stations',
    egyptObjectiveMeetAllNpcs: 'Talk to Dr. Layla Hassan at Nile Expedition Camp to begin Stage 1: DISCOVER',
    egyptObjectiveAllSitesVisited: 'Stage 1 DISCOVER Complete (+50 XP)! Talk to Dr. Layla to start Stage 2: BUILD.',
    egyptControlsHint: 'Walk: WASD / Arrows · Look: Drag / Q & R · Interact: E or Tap · Guide: Expedition Guide',
    egyptFallback2dNotice: 'Using accessible 2D Egypt Expedition Map (same 5 landmarks, 4 NPCs, Nile River, and paths).',
    egyptGuideButton: 'Expedition Guide',
    egyptGuideTitle: 'Egypt Archaeological Expedition Guide',
    egyptGuideSubtitle: '5 Expedition Zones · TO GIVE INSTRUCTIONS (A2–B1)',
    egyptGuideTabRoute: 'Expedition Route',
    egyptGuideTabSites: 'Site Field Notes',
    egyptGuideTabStages: 'Stages & Missions',
    egyptGuideRouteTitle: 'Nile & Giza Expedition Route (1 → 5)',
    egyptGuideRouteDesc: 'Follow your active stage sequentially from Nile Camp to the Chamber Entrance.',
    egyptGuideNextStopBadge: 'Next Station',
    egyptGuideAllVisitedNote: 'All 5 stations mastered! Review any challenge or inspect My Expedition Instructions anytime.',
    egyptGuideVisitedBadge: 'Visited',
    egyptGuideNotVisitedBadge: 'Not Visited',
    egyptGuideGuideMeButton: 'Guide Beacon',
    egyptGuideGuidingActiveButton: 'Guiding Active',
    egyptGuideStopGuideButton: 'Clear Guide',
    egyptGuideLanguageFocusLabel: 'Language Focus (TO GIVE INSTRUCTIONS)',
    egyptGuideCulturalNoteLabel: 'Historical & Archaeological Note',
    egyptGuideFutureStagesNote: 'Stages 1 (DISCOVER) & 2 (BUILD) are playable (+50 XP each). Stages 3–4 unlock next.',
    egyptGuideStageDiscoverTitle: 'Stage 1 · DISCOVER — Secrets of the Pharaohs',
    egyptGuideStageDiscoverDesc: 'Master imperatives, directions, sequences, guardian rules, and symbolic codes across 5 interactive mini-games.',
    egyptGuideStageBuildTitle: 'Stage 2 · BUILD — Ancient Instruction Builder',
    egyptGuideStageBuildDesc: 'Forge packing commands, simulate Giza routes, build papyrus scrolls, write temple rules, and compose the Master Blueprint.',
    egyptGuideStagePracticeTitle: 'Stage 3 · PRACTICE — Field Team Spoken Guidance',
    egyptGuideStagePracticeDesc: 'Give spoken multi-step directions and alignment cues across the plateau and temple courtyard.',
    egyptGuideStagePerformTitle: 'Stage 4 · PERFORM — Unlocking the Chamber of Wisdom',
    egyptGuideStagePerformDesc: 'Lead the final expedition briefing to unseal the Chamber of Wisdom and earn the Egypt Passport Stamp.',
    egyptGuideComingSoonPhase5B: 'Active Now',
    egyptGuideLockedFuturePhase: 'Coming Soon',
    egyptGuideZeroXpExplorationNote: 'Individual workshops grant +0 XP · Completing all 5 BUILD workshops awards +50 XP once',
    egyptListenDialogue: 'Listen',
    egyptReplayDialogue: 'Replay Audio',
    egyptStopAudio: 'Stop Audio',
    egyptNextTipButton: 'Field Tip',
    egyptCloseDialogButton: 'Continue Exploring',
    egyptPauseTitle: 'Egypt Expedition Paused',
    egyptPauseSubtitle: 'Echoes of Egypt · Stage 1 DISCOVER',
    egyptResumeButton: 'Resume Exploring',
    egyptLandmarkBadge: 'Egypt Expedition Site',
    egyptChamberSealedBadge: 'Sealed · Final Expedition Required',
    egyptChamberSealedBanner: 'Monumental Entrance Sealed — Complete Stage 1 DISCOVER here, then future BUILD, PRACTICE, and PERFORM stages to unlock the interior.',
    egyptFictionalVsHistoricalLabel: 'Historical vs Story Distinction',
    egyptZeroXpExploreNote: 'Site visit recorded (+0 XP for free exploration).',
    egyptHudSitesLabel: 'Sites',
    egyptHudNpcsLabel: 'Guides',
    egyptHudGuidingPrefix: 'Beacon',
    egyptSpeakWithPrefix: 'Talk to',
    egyptExploreSitePrefix: 'Inspect',
    egyptNileWaterBoundaryToast: 'Stay safely along the wooden Nile pier and stone embankment!',
    egyptChamberSealedDoorToast: 'The Chamber of Wisdom stays sealed until the final expedition stages—play Game 5 outside the gate!',
    egyptDiscoverStageBadge: 'DISCOVER · Stage 1',
    egyptDiscoverPlayMissionButton: 'Play Challenge',
    egyptDiscoverReviewMissionButton: 'Replay Station',
    egyptDiscoverCompletedBadge: 'Station Completed',
    egyptDiscoverLockedNeedLayla: 'Talk to Dr. Layla Hassan at Nile Expedition Camp (or click Start DISCOVER) to unlock Game 1.',
    egyptDiscoverLockedPrevious: 'Complete the previous station first:',
    egyptDiscoverViaGuideTipNote: 'Guided via landmark expedition tip',
    egyptDiscoverCefrA2Label: 'A2 Level',
    egyptDiscoverCefrB1Label: 'B1 Level',
    egyptDiscoverCefrSwitchNotice: 'Switching A2/B1 resets only the current challenge attempt so answers match the level.',
    egyptDiscoverHearButton: 'Listen',
    egyptDiscoverReplayAudioButton: 'Replay',
    egyptDiscoverStopAudioButton: 'Stop',
    egyptDiscoverHintButton: 'Show Hint',
    egyptDiscoverNextHintButton: 'Deeper Clue',
    egyptDiscoverCheckButton: 'Check Answer',
    egyptDiscoverUndoButton: 'Undo',
    egyptDiscoverResetButton: 'Reset',
    egyptDiscoverNextChallengeButton: 'Next Challenge',
    egyptDiscoverFinishStationButton: 'Complete Station',
    egyptDiscoverReturnGizaButton: 'Return to Giza',
    egyptDiscoverReplayStationButton: 'Practice Again',
    egyptDiscoverStageCompleteTitle: 'Secrets of the Pharaohs — DISCOVER Completed!',
    egyptDiscoverStageCompleteReward: '+50 XP Awarded · 5/5 Instruction Stations Mastered',
    egyptDiscoverKnowledgeSealTitle: 'Expedition Knowledge Seal (Decorative)',
    egyptDiscoverKnowledgeSealNote: 'Decorative Stage 1 Knowledge Seal — earn the official Egypt Passport Stamp after Stage 4 PERFORM!',
    egyptDiscoverBuildComingSoonTitle: 'Stage 2 · BUILD — Coming Soon',
    egyptDiscoverBuildComingSoonDesc: 'Next chapter preview: craft your own step-by-step archaeologist instructions.',
    egyptDiscoverZeroXpStationNote: '+0 XP per mini-game · +50 XP awarded once when all 5 DISCOVER games finish.',
    egyptDiscoverStageIntroLabel: 'Stage 1 Briefing · TO GIVE INSTRUCTIONS',
    egyptDiscoverStationsProgressLabel: 'DISCOVER Stations',
    egyptDiscoverAvailableBadge: 'Available',
    egyptDiscoverLockedBadge: 'Locked',
    egyptDiscoverBuildPreviewBadge: 'Ready After DISCOVER',
    egyptBuildStageBadge: 'BUILD · Stage 2',
    egyptBuildIntroLabel: 'Stage 2 Briefing · ANCIENT INSTRUCTION BUILDER',
    egyptBuildStationsProgressLabel: 'BUILD Workshops',
    egyptBuildPlayWorkshopButton: 'Open BUILD Workshop',
    egyptBuildReviewWorkshopButton: 'Revise Workshop',
    egyptBuildCompletedBadge: 'Workshop Completed',
    egyptBuildLockedNeedDiscover: 'Complete Stage 1: DISCOVER across all 5 stations first to unlock Stage 2: BUILD.',
    egyptBuildLockedNeedLayla: 'Talk to Dr. Layla Hassan (or click Start BUILD) to accept your Expedition Assistant promotion.',
    egyptBuildLockedPrevious: 'Complete the previous BUILD workshop first:',
    egyptBuildTestRouteButton: 'Test Route',
    egyptBuildCheckSignButton: 'Check Rule Sign',
    egyptBuildVerifyScrollButton: 'Verify Scroll',
    egyptBuildSaveBlueprintButton: 'Verify Master Blueprint',
    egyptBuildStageCompleteTitle: 'Ancient Instruction Builder — BUILD Completed!',
    egyptBuildStageCompleteReward: '+50 XP Awarded · 5/5 Construction Workshops Mastered',
    egyptBuildBuilderSealTitle: 'Expedition Assistant Builder Seal (Decorative)',
    egyptBuildBuilderSealNote: 'Decorative Stage 2 Builder Seal — your official Egypt Passport Stamp awaits after Stage 4 PERFORM!',
    egyptBuildPracticeComingSoonTitle: 'Stage 3 · PRACTICE — Coming Soon',
    egyptBuildPracticeComingSoonDesc: 'Next chapter preview: speak and role-play your own Egypt expedition instructions aloud.',
    egyptBuildZeroXpStationNote: '+0 XP per workshop · +50 XP awarded once when all 5 BUILD workshops finish.',
    egyptBuildOpenJournalButton: 'My Instructions',
    egyptJournalTabLabel: 'My Instructions',
    egyptJournalTitle: 'My Expedition Instructions',
    egyptJournalSubtitle: 'Saved English instructions constructed in Stage 2 BUILD (ready for Stage 3 PRACTICE)',
    egyptJournalEmptyState: 'No instructions recorded yet. Complete challenges inside Stage 2: BUILD to save your own constructions here!',
    egyptJournalRevisionPolicyNote: 'Revision Policy: Replaying a challenge updates that challenge’s journal entry cleanly without creating duplicates.',
    egyptJournalListenButton: 'Listen',
    egyptJournalBlueprintPreviewTitle: 'Expedition Master Blueprint Preview',
  },
  th: {
    brandName: 'VoxVoyage',
    tagline: 'Your Voice. Your Voyage.',
    playButton: 'เล่นเลย',
    continueButton: 'ผจญภัยต่อ',
    settingsButton: 'ตั้งค่า',
    closeSettings: 'ปิด',
    enterWorldButton: 'เข้าสู่โลกนี้',
    backToMap: 'แผนที่โลก',
    backToTitle: 'หน้าแรกเกม',
    openPassport: 'พาสปอร์ต',
    settingsTitle: 'ตั้งค่าเกม',
    appearanceLabel: 'ท้องฟ้าและแสง',
    modeDay: 'กลางวัน',
    modeNight: 'กลางคืน',
    modeAuto: 'อัตโนมัติ',
    musicLabel: 'ดนตรีประกอบ',
    sfxLabel: 'เสียงเอฟเฟกต์',
    onLabel: 'เปิด',
    offLabel: 'ปิด',
    tapToPlay: 'แตะเพื่อเล่น',
    languageLabel: 'ภาษา',
    motionLabel: 'แอนิเมชัน',
    motionReduced: 'ลดการเคลื่อนไหว',
    motionStandard: 'ปกติ',
    viewModeLabel: 'มุมมองแผนที่',
    view3D: 'ลูกโลก 3 มิติ',
    view2D: 'แผนที่ 2 มิติ',
    worldMapPrompt: 'เลือกจุดหมายบนลูกโลกเพื่อเริ่มภารกิจ',
    dragHint: 'ลากเพื่อหมุน · แตะหมุดประเทศ',
    webglFallbackNotice: 'ไม่รองรับ 3D ในอุปกรณ์นี้ จึงแสดงแผนที่ 2 มิติแทน',
    xpLabel: 'XP',
    coinsLabel: 'เหรียญ',
    gemsLabel: 'อัญมณี',
    stampsLabel: 'ตราประทับ',
    comingSoonLabel: 'เร็วๆ นี้',
    lockedLabel: 'ล็อกอยู่',
    missionStagesTitle: 'ด่านการผจญภัย 4 ขั้น',
    finalChallengeLabel: 'ภารกิจพูดขั้นสุดท้าย',
    passportTitle: 'พาสปอร์ตนักสำรวจ',
    passportEmptyHint: 'พิชิตภารกิจในแต่ละประเทศเพื่อสะสมตราประทับพาสปอร์ต',
    resetProgress: 'รีเซ็ตข้อมูลการผจญภัย',
    resetDone: 'รีเซ็ตข้อมูลเรียบร้อยแล้ว',
    avatarTitle: 'ตัวละครนักสำรวจ',
    avatarComingSoon: 'ระบบแต่งตัวละคร 3 มิติเต็มรูปแบบจะเปิดให้เล่นเร็วๆ นี้',
    continueToWorldMap: 'ไปยังแผนที่โลก',
    speakHint: 'พบกับไกด์ท้องถิ่นก่อนเริ่มต้นภารกิจฝึกพูดภาษาอังกฤษ',
    avatarStudioTitle: 'สร้างตัวละครนักสำรวจ',
    explorerNameLabel: 'ชื่อนักสำรวจ',
    explorerNamePlaceholder: 'พิมพ์ชื่อนักสำรวจ',
    backButton: 'ย้อนกลับ',
    randomizeButton: 'สุ่มลุค',
    waveButton: 'ทักทาย',
    confirmExplorerButton: 'ยืนยันตัวละคร',
    tabBodySkin: 'รูปร่างและผิว',
    tabHair: 'ทรงผม',
    tabOutfit: 'ชุดเดินทาง',
    tabBackpack: 'กระเป๋าเป้',
    baseModelLabel: 'รูปแบบตัวละคร',
    skinToneLabel: 'สีผิว',
    hairStyleLabel: 'ทรงผม',
    hairColorLabel: 'สีผม',
    travelOutfitLabel: 'ชุดนักสำรวจ',
    outfitColorLabel: 'สีชุด',
    backpackColorLabel: 'สีกระเป๋าเป้',
    rotateAvatarHint: 'ลากเพื่อหมุนดูได้รอบ 360°',
    passportIntroTitle: 'พาสปอร์ตนักสำรวจของคุณพร้อมแล้ว!',
    passportIntroMessage: 'ออกเดินทางสู่ 5 ประเทศ ฝึกพูดภาษาอังกฤษกับไกด์ท้องถิ่น และสะสมตราประทับให้ครบทุกประเทศ',
    enterWorldMapButton: 'เข้าสู่แผนที่โลก',
    editExplorerButton: 'แต่งตัวละคร',
    arrivingJaipurTitle: 'กำลังเดินทางสู่ชัยปุระ',
    arrivingJaipurSubtitle: 'นครสีชมพู · รัฐราชสถาน ประเทศอินเดีย',
    jaipurLandmarksLabel: 'จุดสำรวจ',
    jaipurMoveHint: 'WASD / ปุ่มลูกศร เพื่อเดิน',
    jaipurCameraHint: 'ลากเพื่อหันกล้อง · กด E เพื่อโต้ตอบ',
    jaipurInteractLabel: 'โต้ตอบ',
    jaipurInteractPromptPrefix: 'กด E หรือแตะ:',
    jaipurSpeakWithAarav: 'คุยกับคุณอาราฟ',
    jaipurInspectLandmark: 'สำรวจจุดนี้',
    jaipurExploreCompleteBadge: 'สำรวจครบทั้ง 3 จุดสำคัญในชัยปุระแล้ว!',
    jaipurFallbackNotice: 'กำลังใช้งานมุมมองลานชัยปุระแบบ 2 มิติ — เดินสำรวจจุดสำคัญทั้ง 3 แห่งได้ครบ',
    jaipurNextButton: 'ถัดไป',
    jaipurListenButton: 'ฟังเสียง',
    jaipurCameraSensitivity: 'กล้อง',
    jaipurSensitivityLow: 'นุ่มนวล',
    jaipurSensitivityMed: 'ปกติ',
    jaipurSensitivityHigh: 'ไว',
    jaipurTouchPadShow: 'ปุ่มเดินบนจอ',
    jaipurTouchPadHide: 'ซ่อนปุ่มเดิน',
    jaipurBackToJaipur: 'กลับสู่ชัยปุระ',
    jaipurCulturalNoteLabel: 'บันทึกภาคสนามนักสำรวจ',
    jaipurObjectiveTalkAarav: 'คุยกับคุณอาราฟ ชาร์มา',
    jaipurObjectiveFindObjects: 'นักสืบคำศัพท์: หา 5 สิ่งในฉาก',
    jaipurObjectiveCompleted: 'พิชิตนักสืบคำศัพท์สำเร็จ!',
    jaipurObjectsFoundLabel: 'พบแล้ว',
    jaipurPauseMenuTitle: 'หยุดชั่วคราว',
    jaipurResumeButton: 'เล่นต่อ',
    jaipurWordFoundBadge: 'บันทึกคำศัพท์ลงภารกิจแล้ว!',
    jaipurWordAlreadyFoundBadge: 'เก็บคำศัพท์นี้แล้ว',
    jaipurStartExploringButton: 'ออกสำรวจเลย!',
    jaipurCelebrationTitle: 'พิชิตภารกิจนักสืบคำศัพท์สำเร็จ!',
    jaipurCelebrationSubtitle: 'คุณค้นพบคำศัพท์ทั้ง 5 คำในชัยปุระครบแล้ว เก่งมาก!',
    jaipurFallback2dObjectiveNotice: 'โหมด 2 มิติ — เดินหรือแตะที่อาราฟและสิ่งของทั้ง 5 อย่างเพื่อเล่นจนจบภารกิจ',
    jaipurBuildUnlockedNoticeTitle: 'ปลดล็อกภารกิจใหม่: ขบวนรถไฟเรียงประโยค',
    jaipurBuildUnlockedNoticeBody: 'เดินกลับไปหาคุณอาราฟ ชาร์มา เพื่อเริ่มฝึกเรียง 5 ประโยค',
    jaipurObjectiveTalkAaravBuild: 'คุยกับคุณอาราฟ: เริ่ม Sentence Train',
    jaipurObjectivePracticeUnlocked: 'พิชิต Sentence Train แล้ว · ปลดล็อกด่าน Practice',
    jaipurStartSentenceTrainButton: 'เริ่มขบวนรถไฟเรียงประโยค',
    jaipurReplaySentenceTrainButton: 'เล่นขบวนรถไฟซ้ำ',
    sentenceTrainTitle: 'ขบวนรถไฟเรียงประโยค',
    sentenceTrainCounterLabel: 'ประโยคที่',
    sentenceTrainTrackHint: 'แตะหรือลากการ์ดคำมาเรียงบนรางรถไฟให้ถูกต้อง',
    sentenceTrainBankLabel: 'การ์ดคำศัพท์',
    sentenceTrainUndoButton: 'ย้อนกลับ',
    sentenceTrainResetButton: 'เริ่มใหม่',
    sentenceTrainCheckButton: 'ตรวจคำตอบ',
    sentenceTrainNextButton: 'ประโยคถัดไป',
    sentenceTrainFinishButton: 'จบขบวนรถไฟ',
    sentenceTrainSuccessBanner: 'เก่งมาก! เรียงประโยคได้ถูกต้องสมบูรณ์!',
    sentenceTrainCelebrateTitle: 'พิชิตขบวนรถไฟเรียงประโยคสำเร็จ!',
    sentenceTrainCelebrateSubtitle: 'คุณเรียงครบทั้ง 5 ประโยคแล้ว ปลดล็อกด่านที่ 3: Practice เรียบร้อย!',
    sentenceTrainPracticeUnlockedTag: 'ปลดล็อกด่าน 3: Practice แล้ว',
    sentenceTrainReplayNotice: 'โหมดฝึกซ้อมซ้ำ — ผ่านภารกิจนี้แล้ว',
    jaipurPracticeUnlockNoticeTitle: 'ปลดล็อกภารกิจใหม่: Spot & Speak',
    jaipurPracticeUnlockNoticeBody: 'เดินกลับไปหาคุณอาราฟ ชาร์มา เพื่อเริ่มฝึกพูดตามจุดสำคัญ',
    jaipurObjectiveTalkAaravPractice: 'คุยกับคุณอาราฟ: เริ่ม Spot & Speak',
    jaipurObjectiveSpotAndSpeak: 'Spot & Speak: ฝึกพูด 5 จุด',
    jaipurObjectivePerformUnlocked: 'พิชิต Spot & Speak แล้ว · ปลดล็อกด่าน Perform',
    jaipurStartSpotAndSpeakButton: 'เริ่มภารกิจ Spot & Speak',
    jaipurSpeakHerePrompt: 'ฝึกพูดจุดนี้',
    spotSpeakNextSpotPrefix: 'จุดถัดไป:',
    spotSpeakProgressLabel: 'ฝึกพูดแล้ว',
    spotSpeakStepLook: '1. ดู',
    spotSpeakStepListen: '2. ฟัง',
    spotSpeakStepSpeak: '3. พูด',
    spotSpeakStepReview: '4. ทบทวน',
    spotSpeakHintsToggleShow: 'ดูคำศัพท์ช่วยจำ',
    spotSpeakHintsToggleHide: 'ซ่อนคำศัพท์ช่วยจำ',
    spotSpeakModelLabel: 'ประโยคตัวอย่าง',
    spotSpeakAudioNotice: 'เสียงตัวอย่างจากเบราว์เซอร์ (สังเคราะห์เสียง)',
    spotSpeakStartMicButton: 'เริ่มอัดเสียง',
    spotSpeakStopMicButton: 'หยุดอัดเสียง',
    spotSpeakRecordingStatus: 'กำลังอัดเสียง',
    spotSpeakPlaybackButton: 'ฟังเสียงที่อัดไว้',
    spotSpeakPauseAudioButton: 'หยุดฟังชั่วคราว',
    spotSpeakRetryButton: 'อัดเสียงใหม่',
    spotSpeakMicDeniedNotice: 'ไม่ได้รับอนุญาตให้ใช้ไมโครโฟน คุณสามารถฝึกพูดต่อด้วยโหมดไม่ใช้ไมโครโฟนด้านล่าง',
    spotSpeakMicUnavailableNotice: 'อุปกรณ์นี้ไม่รองรับการอัดเสียงผ่านเบราว์เซอร์ กรุณาใช้โหมดไม่ใช้ไมโครโฟนด้านล่าง',
    spotSpeakNoMicToggle: 'ฝึกแบบไม่ใช้ไมโครโฟน',
    spotSpeakMicToggle: 'กลับไปใช้ไมโครโฟน',
    spotSpeakNoMicPrompt: 'อ่านประโยคตัวอย่างออกเสียงดังชัดเจน แล้วเลือกวลีสำคัญที่ตรงกับประโยค:',
    spotSpeakNoMicAloudCheck: 'ฉันอ่านประโยคตัวอย่างออกเสียงชัดเจนแล้ว',
    spotSpeakNoMicReadyButton: 'ไปยังขั้นทบทวนตนเอง',
    spotSpeakSelfReviewHeading: 'ทบทวนตนเองและฟังเสียงย้อนหลัง',
    spotSpeakSelfReviewDisclaimer: 'ประเมินตนเองเท่านั้น — เสียงของคุณอยู่ในอุปกรณ์นี้ชั่วคราว ไม่ส่งออกและไม่บันทึกถาวร',
    spotSpeakConfidenceGood: 'พูดได้ชัดเจนแล้ว',
    spotSpeakConfidenceRetry: 'อยากลองพูดอีกครั้ง',
    spotSpeakFeedbackPositiveLabel: 'จุดเด่น',
    spotSpeakFeedbackTipLabel: 'คำแนะนำ 1 ข้อ',
    spotSpeakFeedbackNextLabel: 'ก้าวต่อไป',
    spotSpeakContinueButton: 'บันทึกและไปต่อ',
    spotSpeakCelebrateTitle: 'พิชิตภารกิจ Spot & Speak สำเร็จ!',
    spotSpeakCelebrateSubtitle: 'คุณซ้อมพูดครบทั้ง 5 จุดในชัยปุระแล้ว ปลดล็อกด่านที่ 4: Perform เรียบร้อย!',
    spotSpeakAlreadyDoneNote: 'ฝึกพูดจุดนี้แล้ว — สามารถซ้อมซ้ำได้ตลอด!',
    jaipurPerformUnlockNoticeTitle: 'ปลดล็อกภารกิจสุดท้าย: Jaipur Showcase',
    jaipurPerformUnlockNoticeBody: 'เดินกลับไปหาคุณอาราฟ ชาร์มา เพื่อเริ่มต้นบทบาทมัคคุเทศก์แห่งชัยปุระ!',
    jaipurObjectiveTalkAaravPerform: 'คุยกับคุณอาราฟ: ภารกิจพูดขั้นสุดท้าย',
    jaipurObjectiveMissionComplete: 'พิชิตชัยปุระแล้ว · รับตราประทับอินเดีย',
    jaipurStartFinalShowcaseButton: 'เริ่ม Final Showcase',
    jaipurReplayFinalShowcaseButton: 'เล่น Final Showcase ซ้ำ',
    jaipurReplaySpotAndSpeakButton: 'ซ้อม Spot & Speak',
    showcaseMissionBadge: 'ภารกิจพูดขั้นสุดท้าย · ด่านที่ 4',
    showcaseTitle: 'สวมบทบาทมัคคุเทศก์แห่งชัยปุระ!',
    showcaseBriefText: 'คุณอาราฟเชิญนักเดินทางมารอฟังการนำชมของคุณ ลองพูดแนะนำเมืองชัยปุระเป็นภาษาอังกฤษแบบต่อเนื่องประมาณ 30–60 วินาทีด้วยคำพูดของคุณเอง!',
    showcaseTargetDuration: 'ความยาวแนะนำ: 30–60 วินาที · พูดอย่างเป็นธรรมชาติในแบบของคุณ',
    showcaseStepPrepare: '1. ดูแบบอย่าง',
    showcaseStepPerform: '2. ลงมือพูด',
    showcaseStepReflect: '3. ทบทวน',
    showcaseStepCeremony: '4. รับตราประทับ',
    showcaseRequirementsHeading: 'องค์ประกอบในบทนำเที่ยว',
    showcaseModelHeading: 'ตัวอย่างบทนำชมเมือง',
    showcaseStartersHeading: 'โครงประโยคเริ่มต้นและคำศัพท์ช่วยจำ',
    showcaseVocabHeading: 'คลังคำศัพท์ชัยปุระ',
    showcaseHideScaffoldButton: 'ซ่อนตัวช่วย',
    showcaseShowScaffoldButton: 'แสดงตัวช่วย',
    showcaseScaffoldHiddenNote: 'ซ่อนตัวช่วยแล้ว — ลองถ่ายทอดบทนำเที่ยวด้วยถ้อยคำของคุณเองได้เลย!',
    showcaseGoPerformButton: 'พร้อมนำเที่ยวนักเดินทาง',
    showcaseRecordingHint: 'กล่าวทักทาย แนะนำเมืองชัยปุระ บรรยายอย่างน้อย 3 สถานที่ และกล่าวปิดท้ายอย่างสุภาพ',
    showcaseNoMicHeading: 'โครงร่างนำเที่ยว (โหมดไม่ใช้ไมโครโฟน)',
    showcaseNoMicPickThreeLabel: 'เลือกสถานที่สำคัญในชัยปุระ 3 แห่งสำหรับบทนำชมของคุณ:',
    showcaseNoMicPickedCountLabel: 'เลือกแล้ว',
    showcaseNoMicCustomNoteLabel: 'แต่งประโยคบรรยายเพิ่มเติมของคุณเอง 1 ประโยค (ไม่บังคับ):',
    showcaseNoMicCustomNotePlaceholder: 'เช่น I love the warm pink stone walls of Jaipur.',
    showcaseNoMicAloudCheck: 'ฉันพูดนำเที่ยวเมืองชัยปุระจนจบด้วยเสียงดังชัดเจนแล้ว',
    showcaseGoReflectButton: 'ฟังและทบทวนตนเอง',
    showcaseReflectHeading: 'สะท้อนผลการเป็นมัคคุเทศก์',
    showcaseReflectChecklistPrompt: 'ติ๊กเลือกส่วนที่คุณได้พูดในบทนำเที่ยว:',
    showcaseFinishButton: 'จบภารกิจและรับตราประทับ',
    showcaseReplayFinishButton: 'จบการซ้อมซ้ำ',
    showcaseCeremonyBadge: 'พิชิตภารกิจอินเดียสำเร็จ!',
    showcaseCeremonyTitle: 'ได้รับตราประทับพาสปอร์ตอินเดีย!',
    showcaseCeremonySubtitle: 'คุณได้พานักเดินทางชมเมืองชัยปุระด้วยเสียงของคุณเองสำเร็จแล้ว!',
    showcaseCeremonyReplaySubtitle: 'ซ้อมบทมัคคุเทศก์สำเร็จอีกครั้ง! ตราประทับอินเดียถูกบันทึกไว้เรียบร้อย',
    showcaseTotalXpNote: 'XP รวมจากภารกิจชัยปุระครบทั้ง 4 ด่าน',
    showcaseViewPassportButton: 'เปิดดูพาสปอร์ต',
    showcaseStayJaipurButton: 'สำรวจชัยปุระต่อ',
    passportStampIndiaLabel: 'ชัยปุระ, อินเดีย',
    passportStampDateLabel: 'ได้รับเมื่อ',
    arrivingKenyaTitle: 'กำลังเดินทางสู่มาไซมารา',
    arrivingKenyaSubtitle: 'ซาฟารีพิทักษ์สัตว์ป่า · ประเทศเคนยา',
    kenyaObjectiveExplore: 'สำรวจทุ่งมาไซมารา',
    kenyaSpotsVisitedLabel: 'จุดซาฟารี',
    kenyaSpeakWithAmina: 'คุยกับคุณอามินา',
    kenyaInspectSpot: 'ชมสถานที่',
    kenyaBackToMaasaiMara: 'กลับสู่มาไซมารา',
    kenyaFallback2dNotice: 'โหมด 2 มิติ — เดินหรือแตะที่อามินาและจุดชมสัตว์ป่าทั้ง 5 แห่ง',
    kenyaWildlifeNoteLabel: 'บันทึกเจ้าหน้าที่พิทักษ์ป่า',
    kenyaReadyPreviewBadge: 'สำรวจซาฟารี · เดินชมอิสระ',
    kenyaObjectiveTalkAmina: 'คุยกับเจ้าหน้าที่อามินา',
    kenyaObjectiveDiscover: 'สำรวจสัตว์ป่ามาไซมารา!',
    kenyaDiscoverCountLabel: 'การค้นพบสัตว์ป่า',
    kenyaStartMissionButton: 'เริ่มภารกิจสำรวจสัตว์ป่า',
    kenyaOpenFieldGuideButton: 'สมุดบันทึกสัตว์ป่า',
    kenyaMeetAminaFirstHint: 'เดินไปคุยกับเจ้าหน้าที่อามินาที่แคมป์เจ้าหน้าที่ซาฟารีก่อนเพื่อเริ่มภารกิจ!',
    kenyaCelebrationTitle: 'พิชิตภารกิจ Discover the Wild สำเร็จ!',
    kenyaCelebrationSubtitle: 'รับ +50 XP! บันทึกข้อมูลสัตว์ป่ามาไซมาราครบทั้ง 5 จุดแล้ว',
    kenyaBuildUnlockedBadge: 'ปลดล็อกด่าน BUILD แล้ว',
    kenyaBuildSoonNote: 'กลับไปคุยกับคุณอามินา — ด่านที่ 2: BUILD จะเปิดให้เล่นใน Phase 2C!',
    kenyaDiscoveryRecordedBadge: 'บันทึกในสมุดบันทึกแล้ว',
    kenyaHideThaiLabel: 'ซ่อนคำแปลไทย',
    kenyaShowThaiLabel: 'ตัวช่วยภาษาไทย',
    kenyaVocabHeading: 'คำศัพท์ซาฟารีสำคัญ',
    kenyaTryAgainFeedback: 'ยังไม่ใช่นะ ลองอ่านประโยคด้านบนแล้วเลือกคำตอบใหม่อีกครั้ง!',
    kenyaDiscoverCompleteInlineNote: 'ครบ 5/5 แล้ว! รับ +50 XP และปลดล็อกด่าน BUILD!',
    kenyaDiscoverySavedNote: 'บันทึกข้อมูลลงสมุดบันทึกสัตว์ป่าเรียบร้อยแล้ว!',
    kenyaFieldGuideTitle: 'สมุดบันทึกสัตว์ป่า (Field Guide)',
    kenyaFieldGuideSubtitle: 'สมุดนักสำรวจมาไซมารา',
    kenyaEntryCompleteLabel: 'ค้นพบแล้ว',
    kenyaFieldGuideLockedHint: 'เดินไปสำรวจจุดนี้และตอบคำถามให้ถูกต้องเพื่อปลดล็อกหน้านี้',
    kenyaObjectiveTalkAminaBuild: 'คุยกับคุณอามินา: เริ่ม Safari Fact Builder',
    kenyaObjectiveBuild: 'สร้างป้ายความรู้ซาฟารี',
    kenyaBuildCountLabel: 'ป้ายความรู้',
    kenyaStartBuildButton: 'เริ่มสร้างป้ายความรู้',
    kenyaReturnAminaBuildHint: 'เดินกลับไปหาเจ้าหน้าที่อามินาที่แคมป์เพื่อเริ่มภารกิจ Safari Fact Builder!',
    kenyaBuildCelebrationTitle: 'พิชิต Safari Fact Builder สำเร็จ!',
    kenyaBuildCelebrationSubtitle: 'รับ +50 XP! ป้ายข้อมูลสัตว์ป่าทั้ง 5 จุดพร้อมต้อนรับนักเดินทางแล้ว',
    kenyaPracticeUnlockedBadge: 'ปลดล็อกด่าน PRACTICE แล้ว',
    kenyaPracticeSoonNote: 'ด่านที่ 3: PRACTICE จะเปิดให้เล่นใน Phase 2D!',
    kenyaBoardStationBadge: 'ป้ายสถานีวิจัยซาฟารี',
    kenyaBuildStepStudyBuild: '1. ศึกษาและต่อประโยค',
    kenyaBuildStepSpeak: '2. ฝึกพูดประโยค',
    kenyaBuildStepSaved: '3. บันทึกแล้ว',
    kenyaBuildLevelA2: 'A2 มีตัวช่วย',
    kenyaBuildLevelB1: 'B1 ท้าทาย',
    kenyaBuildModelLabel: 'ประโยคตัวอย่าง',
    kenyaBuildShowHint: 'ดูคำใบ้',
    kenyaBuildHideHint: 'ซ่อนคำใบ้',
    kenyaBuildHintXpSafe: 'ดูคำใบ้ได้ฟรี ไม่หัก XP',
    kenyaBuildClearSlots: 'ล้างป้าย',
    kenyaBuildCheckButton: 'ตรวจประโยค',
    kenyaBuildPreviewLabel: 'ประโยคบนป้ายความรู้ของคุณ',
    kenyaBuildCheckComplete: 'ครบถ้วน',
    kenyaBuildCheckGrammar: 'ไวยากรณ์',
    kenyaBuildCheckFactual: 'ข้อเท็จจริง',
    kenyaBuildGoSpeakButton: 'ไปฝึกพูดประโยคนี้',
    kenyaBuildSpeakHeading: 'ฝึกอ่านป้ายความรู้ของคุณออกเสียง',
    kenyaBuildSpeakNote: 'ฟังเสียงตัวอย่าง อ่านออกเสียงให้ชัดเจน หรืออัดเสียงเพื่อฟังทบทวนด้วยตนเอง',
    kenyaBuildSaveButton: 'บันทึกลงสมุด Field Guide',
    kenyaBuildAlreadySavedNote: 'บันทึกไว้ในสมุด Field Guide แล้ว — แก้ไขหรือซ้อมพูดใหม่ได้เสมอ!',
    kenyaBuildCompleteInlineNote: 'ครบ 5/5 ป้ายแล้ว! รับ +50 XP และปลดล็อกด่าน PRACTICE!',
    kenyaFieldGuideSentencesHeading: 'My Safari Sentences · ประโยคของฉัน',
    kenyaFieldGuideSentenceBuiltBadge: 'สร้างประโยคแล้ว',
    kenyaFieldGuideSentencePending: 'ไปที่สถานีนี้ในภารกิจ Safari Fact Builder เพื่อสร้างและบันทึกประโยคภาษาอังกฤษของคุณ',
    kenyaFieldGuideBuiltSummary: 'ประโยคที่สร้าง',
    kenyaObjectiveTalkAminaPractice: 'คุยกับคุณอามินา: เริ่มทัวร์ฝึกพูดซาฟารี',
    kenyaObjectivePractice: 'ทัวร์ฝึกพูด WildSpeak Safari',
    kenyaPracticeCountLabel: 'บทสนทนาซาฟารี',
    kenyaStartPracticeButton: 'เริ่มทัวร์ซาฟารี',
    kenyaReturnAminaPracticeHint: 'เดินกลับไปหาเจ้าหน้าที่อามินาที่แคมป์เพื่อเริ่มภารกิจ WildSpeak Safari Tour!',
    kenyaPracticeCelebrationTitle: 'พิชิต WildSpeak Safari Tour สำเร็จ!',
    kenyaPracticeCelebrationSubtitle: 'รับ +50 XP! คุณตอบคำถามนักท่องเที่ยวครบทั้ง 5 จุดเป็นภาษาอังกฤษแล้ว',
    kenyaPerformUnlockedBadge: 'ปลดล็อกด่าน PERFORM แล้ว',
    kenyaPerformSoonNote: 'ด่านที่ 4: PERFORM จะเปิดให้เล่นในอัปเดตถัดไป!',
    kenyaPracticeStepListen: '1. ฟัง',
    kenyaPracticeStepPrepare: '2. เตรียม',
    kenyaPracticeStepSpeak: '3. พูด',
    kenyaPracticeStepReview: '4. ทบทวน',
    kenyaPracticeStepDone: '5. สำเร็จ',
    kenyaPracticeModeGuided: 'มีตัวช่วยเต็มที่',
    kenyaPracticeModeSupported: 'ช่วยปานกลาง',
    kenyaPracticeModeIndependent: 'พูดด้วยตนเอง',
    kenyaPracticeIndependentEncourage: 'ด่านสุดท้ายของไกด์ — ลองเริ่มแบบพูดด้วยตนเองก่อนนะ (กดดูตัวช่วยได้ฟรีเสมอ)!',
    kenyaPracticeReplayQuestion: 'ฟังคำถามอีกครั้ง',
    kenyaPracticeQuestionTargetLabel: 'เป้าหมายการพูด',
    kenyaPracticeSavedSentenceLabel: 'ประโยคที่คุณสร้างไว้',
    kenyaPracticeStarterLabel: 'โครงประโยคเริ่มต้น',
    kenyaPracticeModelLabel: 'ตัวอย่างคำตอบ',
    kenyaPracticeListenModel: 'ฟังประโยคตัวอย่าง',
    kenyaPracticeRevealModel: 'ดูประโยคตัวอย่าง',
    kenyaPracticeHideModel: 'ซ่อนประโยคตัวอย่าง',
    kenyaPracticeHelpShow: 'ดูตัวช่วยและคำศัพท์',
    kenyaPracticeHelpHide: 'ซ่อนตัวช่วย',
    kenyaPracticeHelpXpSafe: 'ใช้ตัวช่วยได้ฟรี ไม่หัก XP',
    kenyaPracticeSpeakingPromptNote: 'ลองพูดตอบคำถามนักท่องเที่ยวด้วยคำพูดของคุณเองอย่างชัดเจน',
    kenyaPracticeNoMicAloudCheck: 'ฉันได้ฝึกพูดตอบคำถามออกเสียงอย่างชัดเจนแล้ว',
    kenyaPracticeChecklistHeading: 'รายการทบทวนตนเอง (Self-Reflection)',
    kenyaPracticeChecklistHint: 'เลือกอย่างน้อย 1 ข้อที่ตรงกับสิ่งที่คุณพูดก่อนกดบันทึกจบจุดนี้',
    kenyaPracticeCheckAnswered: 'ฉันตอบตรงตามคำถามของนักท่องเที่ยว',
    kenyaPracticeCheckFact: 'ฉันใส่ข้อเท็จจริงเกี่ยวกับสัตว์ป่าหรือมาไซมาราอย่างถูกต้อง',
    kenyaPracticeCheckClear: 'ฉันพูดชัดเจนในจังหวะที่สม่ำเสมอ',
    kenyaPracticeCheckConnector: 'ฉันใช้คำศัพท์จาก Field Guide หรือคำเชื่อม เช่น "because" / "to" / "should"',
    kenyaPracticeFeedbackHeading: 'คำแนะนำฝึกพูดและทบทวนตนเอง',
    kenyaPracticeFeedbackHonestBadge: 'แนวทางฝึกซ้อม · เสียงอัดอยู่ในเครื่องของคุณเท่านั้น',
    kenyaPracticeCompleteButton: 'จบบทสนทนานี้',
    kenyaPracticeDoneHeading: 'จบบทสนทนาสำเร็จ!',
    kenyaPracticeAlreadyDoneNote: 'ซ้อมจุดนี้แล้ว — กลับมาฝึกพูดซ้ำได้ทุกเมื่อ!',
    kenyaPracticeContinueTour: 'เดินทางทัวร์ต่อ',
    kenyaObjectiveTalkAminaPerform: 'คุยกับคุณอามินา: ภารกิจสุดท้าย',
    kenyaObjectivePerformReady: 'เวทีจุดชมวิวอนุรักษ์: กล่าวสุนทรพจน์',
    kenyaObjectiveMissionComplete: 'พิชิตเคนยาแล้ว · รับตราประทับเคนยา',
    kenyaStartFinalChallengeButton: 'เริ่มภารกิจสุดท้าย',
    kenyaReplayFinalChallengeButton: 'ขึ้นเวทีทูตสัตว์ป่าซ้ำ',
    kenyaReplaySafariTourButton: 'ซ้อมทัวร์ซาฟารี',
    kenyaOpenStagePrompt: 'เวทีทูตสัตว์ป่า',
    kenyaPerformMissionBadge: 'พิทักษ์ทุ่งสะวันนา · ด่านที่ 4 PERFORM',
    kenyaPerformTitle: 'ภารกิจทูตพิทักษ์สัตว์ป่าขั้นสุดท้าย',
    kenyaPerformTargetDuration: 'ความยาวแนะนำ: 60–90 วินาที · พูดด้วยคำของคุณเอง',
    kenyaPerformStepBriefing: '1. รับภารกิจ',
    kenyaPerformStepPrepare: '2. เตรียมพูด',
    kenyaPerformStepSpeech: '3. สุนทรพจน์',
    kenyaPerformStepQa: '4. ถาม–ตอบ',
    kenyaPerformStepReflect: '5. ตราประทับ',
    kenyaPerformGoalsHeading: 'เป้าหมาย 5 ข้อของทูตพิทักษ์สัตว์ป่า',
    kenyaPerformBriefIntro: 'ก้าวขึ้นสู่เวทีกลางแจ้งที่จุดชมวิวอนุรักษ์ต่อหน้าเจ้าหน้าที่อามินา เอ็มม่า และแดเนียล ถ่ายทอดความรู้เรื่องสัตว์ป่ามาไซมาราและเชิญชวนนักท่องเที่ยวร่วมดูแลธรรมชาติ!',
    kenyaPerformGoPrepareButton: 'เตรียมสุนทรพจน์ของคุณ',
    kenyaPerformPrepFactsHeading: 'เลือกข้อเท็จจริงสัตว์ป่าอย่างน้อย 2 ข้อ',
    kenyaPerformPrepFactsHint: 'ดึงข้อมูลจากสมุด Field Guide และประโยคที่คุณสร้างไว้ในด่าน BUILD',
    kenyaPerformPrepReasonsHeading: 'เลือกเหตุผลว่าทำไมการอนุรักษ์จึงสำคัญ (อย่างน้อย 1 ข้อ)',
    kenyaPerformPrepActionsHeading: 'เลือกคำแนะนำเชิงโน้มน้าวใจเพื่อการอนุรักษ์ (อย่างน้อย 1 ข้อ)',
    kenyaPerformCueCardHeading: 'การ์ดช่วยจำสำหรับการพูด (Cue Cards)',
    kenyaPerformCustomNoteLabel: 'เพิ่มคำทักทายหรือข้อความปิดท้ายของคุณเอง (ไม่บังคับ)',
    kenyaPerformCustomNotePlaceholder: 'เช่น Let us keep the savanna wild and safe for every animal!',
    kenyaPerformScaffoldShow: 'แสดงตัวช่วยและตัวอย่าง',
    kenyaPerformScaffoldHide: 'ซ่อนตัวช่วย',
    kenyaPerformScaffoldHiddenNote: 'ซ่อนตัวช่วยแล้ว — ลองพูดนำเสนออย่างเป็นธรรมชาติด้วยถ้อยคำของคุณเองได้เลย!',
    kenyaPerformModelSpeechHeading: 'ตัวอย่างสุนทรพจน์ความยาว 60–90 วินาที (ดูเป็นแนวทาง)',
    kenyaPerformStartersHeading: 'โครงประโยคเริ่มต้นที่แนะนำ',
    kenyaPerformVocabHeading: 'คำศัพท์สำคัญจาก Field Guide',
    kenyaPerformFromBuildTag: 'ประโยคจากด่าน BUILD ของคุณ',
    kenyaPerformStepOntoStageButton: 'ก้าวขึ้นสู่เวที',
    kenyaPerformStageHint: 'แนะนำมาไซมารา เล่าข้อเท็จจริง 2+ ข้อ อธิบายเหตุผลที่ควรอนุรักษ์ และแนะนำแนวทางปฏิบัติ 1+ ข้อ',
    kenyaPerformCueCardsToggle: 'การ์ดช่วยจำ',
    kenyaPerformHearOpeningButton: 'ฟังเสียงตัวอย่าง',
    kenyaPerformTimerSuggestedLabel: 'แนะนำ 60–90 วินาที',
    kenyaPerformTimerSweetSpotNote: 'ความยาวกำลังดีเลย! พูดต่อไปจนจบอย่างเป็นธรรมชาติได้นะ',
    kenyaPerformNoMicAloudCheck: 'ฉันพูดสุนทรพจน์ทูตพิทักษ์สัตว์ป่าจนจบด้วยเสียงดังชัดเจนแล้ว',
    kenyaPerformGoQaButton: 'เข้าสู่ช่วงถาม–ตอบกับนักท่องเที่ยว (2 ข้อ)',
    kenyaPerformQaHeading: 'ช่วงถาม–ตอบกับนักท่องเที่ยว · เอ็มม่าและแดเนียล',
    kenyaPerformQaIntro: 'ฟังคำถามทั้ง 2 ข้อจากผู้มาเยือนและฝึกพูดตอบเป็นภาษาอังกฤษ',
    kenyaPerformQaNoMicCheck: 'ฉันฝึกพูดตอบคำถามของนักท่องเที่ยวข้อนี้ด้วยเสียงดังชัดเจนแล้ว',
    kenyaPerformQaAnsweredBadge: 'ตอบแล้ว',
    kenyaPerformGoReflectButton: 'ทบทวนและสะท้อนผล',
    kenyaPerformReflectHeading: 'สะท้อนผลการสื่อสารบทบาททูตสัตว์ป่า',
    kenyaPerformReflectDisclaimer: 'ประเมินตนเองอย่างตรงไปตรงมา — ไม่มีการถอดข้อความหรือให้คะแนนด้วย AI ลองฟังเสียงที่อัดไว้และทบทวนเป้าหมายการพูดแต่ละข้อด้วยตนเอง',
    kenyaPerformReflectPrompt: 'ทบทวนทักษะการสื่อสารทั้ง 6 ด้านของทูตพิทักษ์สัตว์ป่า:',
    kenyaPerformReflectSpeechAudioLabel: 'สุนทรพจน์หลัก',
    kenyaPerformRubricStrongLabel: 'ทำได้ดีแล้ว',
    kenyaPerformRubricPracticeLabel: 'อยากฝึกเพิ่ม',
    kenyaPerformFinishButton: 'จบภารกิจและรับตราประทับเคนยา',
    kenyaPerformReplayFinishButton: 'จบการซ้อมขึ้นเวที',
    kenyaPerformCeremonyBadge: 'พิชิตภารกิจเคนยาสำเร็จ!',
    kenyaPerformCeremonyTitle: 'ได้รับตราประทับพาสปอร์ตเคนยา!',
    kenyaPerformCeremonySubtitle: 'เจ้าหน้าที่อามินา เอ็มม่า และแดเนียลปรบมือชื่นชมสุนทรพจน์ทูตพิทักษ์สัตว์ป่าของคุณ!',
    kenyaPerformCeremonyReplaySubtitle: 'ยอดเยี่ยมมาก! ตราประทับเคนยายังคงถูกบันทึกไว้ในพาสปอร์ตของคุณเรียบร้อย',
    kenyaPerformAmbassadorTitle: 'ทูตพิทักษ์สัตว์ป่า (Wildlife Ambassador)',
    kenyaPerformTotalXpNote: 'XP รวมภารกิจเคนยาครบทั้ง 4 ด่าน',
    kenyaPerformCumulativeXpNote: 'XP สะสมรวมกับอินเดีย',
    kenyaPerformStayKenyaButton: 'กลับสู่มาไซมารา',
    kenyaPerformViewPassportButton: 'เปิดดูพาสปอร์ต',
    worldMapCompletedBadge: 'พิชิตแล้ว',
    worldMapStatusAvailable: 'พร้อมสำรวจ',
    worldMapStatusInProgress: 'กำลังสำรวจ',
    worldMapStatusLocked: 'ล็อกอยู่',
    worldMapStatusComingSoon: 'เร็ว ๆ นี้',
    worldMapScotlandUnlockHint: 'พิชิตภารกิจ เคนยา — ซาฟารีพิทักษ์สัตว์ป่า เพื่อปลดล็อกสกอตแลนด์',
    worldMapComingSoonHint: 'จุดหมายปลายทางในบทถัดไปของ VoxVoyage — พบกันเร็ว ๆ นี้',
    worldMapEgyptUnlockedBadge: 'ปลดล็อกแล้ว · เร็ว ๆ นี้',
    worldMapEgyptUnlockedHint: 'ปลดล็อกบทอียิปต์แล้ว! การผจญภัย 3 มิติในอียิปต์จะเปิดให้เล่นในบทถัดไป',
    worldMapComingSoonButton: 'เร็ว ๆ นี้',
    worldMapLockedButton: 'พิชิตเคนยาก่อน',
    arrivingScotlandTitle: 'เดินทางถึงที่ราบสูงสกอตแลนด์',
    arrivingScotlandSubtitle: 'วีรชนแห่งไฮแลนด์ · สกอตแลนด์',
    scotlandHudTitle: 'วีรชนแห่งไฮแลนด์',
    scotlandHudSubtitle: 'สำรวจสกอตแลนด์',
    scotlandBackToHighlands: 'กลับสู่สกอตแลนด์',
    scotlandFallback2dNotice: 'โหมด 2 มิติเข้าถึงง่าย — เดินหรือแตะไอลีด ฟิโอนา และสถานที่ทั้ง 5 แห่ง',
    scotlandExploredCountLabel: 'สำรวจแล้ว',
    scotlandObjectiveExplore: 'พบไอลีดและสำรวจสถานที่ไฮแลนด์ทั้ง 5 แห่ง',
    scotlandObjectiveDone: 'สำรวจหมู่บ้านไฮแลนด์ครบแล้ว · พบกับภารกิจถัดไปเร็ว ๆ นี้',
    scotlandSpeakWithPrefix: 'คุยกับ',
    scotlandExploreSpotPrefix: 'สำรวจ',
    scotlandContinueButton: 'อ่านต่อ',
    scotlandCloseButton: 'ปิด',
    scotlandCulturalFocusLabel: 'หัวข้อทางวัฒนธรรม',
    scotlandEverydayVsTraditionLabel: 'ประเพณีและชีวิตประจำวัน',
    scotlandComparePromptLabel: 'ชวนเชื่อมโยงกับไทย',
    scotlandMarkExploredButton: 'บันทึกการเยี่ยมชม',
    scotlandAlreadyExploredLabel: 'สำรวจสถานที่นี้แล้ว',
    scotlandExplorationNote: 'โหมดสำรวจอิสระ — ยังไม่มีแบบทดสอบ คะแนน หรือตราประทับในบทนี้',
    scotlandDiscoverStageBadge: 'ด่านที่ 1 · DISCOVER',
    scotlandStartCultureQuestButton: 'เริ่มภารกิจค้นหาวัฒนธรรมสกอตแลนด์',
    scotlandOpenJournalButton: 'สมุดบันทึกวัฒนธรรม',
    scotlandEvidenceHudLabel: 'หลักฐานวัฒนธรรม',
    scotlandObjectiveTalkEilidhStart: 'คุยกับไอลีดเพื่อเริ่มภารกิจค้นหาวัฒนธรรมสกอตแลนด์',
    scotlandObjectiveCollectEvidence: 'เก็บการ์ดหลักฐานวัฒนธรรมให้ครบ 5 จุดทั่วไฮแลนด์',
    scotlandObjectiveDiscoverComplete: 'จบด่าน DISCOVER แล้ว · เตรียมพบด่าน BUILD',
    scotlandDiscoverBannerTitle: 'พิชิตด่าน DISCOVER · รับ +50 XP!',
    scotlandDiscoverBannerSubtitle: 'บันทึกการ์ดหลักฐานครบ 5 ใบแล้ว! เตรียมพบกับด่านที่ 2: BUILD ในบทถัดไป',
    scotlandStartQuestPromptNote: 'คุยกับไอลีดก่อนเพื่อเปิดภารกิจเก็บหลักฐานวัฒนธรรม',
    scotlandInspectionBeforeQuestNote: 'คุยกับไอลีดแล้วเลือก “เริ่มภารกิจค้นหาวัฒนธรรมสกอตแลนด์” เพื่อปลดล็อกกิจกรรมประจำจุดนี้',
    scotlandLaunchChallengeButton: 'เปิดกิจกรรมวัฒนธรรม',
    scotlandJournalTitle: 'สมุดบันทึกนักสำรวจวัฒนธรรมสกอตแลนด์',
    scotlandJournalSubtitle: 'คลังข้อมูลนิทรรศการสกอตแลนด์–ไทย',
    scotlandJournalLockedCardHint: 'แวะสำรวจสถานที่นี้ระหว่างภารกิจและทำกิจกรรมให้สำเร็จ เพื่อบันทึกหลักฐานไว้ที่นี่',
    scotlandJournalFactLabel: 'ข้อเท็จจริงวัฒนธรรมสกอตแลนด์',
    scotlandJournalVocabLabel: 'คำศัพท์วัฒนธรรมสำคัญ',
    scotlandJournalThaiLinkLabel: 'จุดเชื่อมโยงกับประเทศไทย',
    scotlandJournalCompareLabel: 'บันทึกความเหมือนและความต่าง',
    scotlandSimilarityShortLabel: 'ความเหมือน',
    scotlandDifferenceShortLabel: 'ความต่าง',
    scotlandLanguageBridgeLabel: 'โครงสร้างเปรียบเทียบ',
    scotlandJournalCompleteNote: 'เก็บการ์ดหลักฐานวัฒนธรรมครบทั้ง 5 ใบแล้ว!',
    scotlandJournalProgressNote: 'เก็บหลักฐานให้ครบทุกจุดเพื่อเตรียมพร้อมสู่ด่านที่ 2: BUILD',
    scotlandScaffoldModeLabel: 'ระดับตัวช่วย',
    scotlandModeA2Label: 'A2 มีตัวช่วย',
    scotlandModeB1Label: 'B1 ท้าทาย',
    scotlandHintButton: 'คำใบ้',
    scotlandStationSavedTitle: 'บันทึกหลักฐานวัฒนธรรมสำเร็จ!',
    scotlandStationFirstSaveNote: 'บันทึกลงสมุดนักสำรวจแล้ว เก็บให้ครบ 5 จุดเพื่อรับ +50 XP!',
    scotlandStationReplayNote: 'บันทึกไว้ในสมุดแล้ว — เล่นซ้ำเพื่อทบทวนได้เสมอ (+0 XP เพิ่ม)',
    scotlandReplayActivityButton: 'เล่นซ้ำอีกครั้ง',
    scotlandContinueExploringButton: 'ออกสำรวจต่อ',
    scotlandReadLandmarkNoteButton: 'อ่านข้อมูลสถานที่',
    scotlandStation1Instruction: 'เลือกเบาะแสแต่ละจุดในหมู่บ้านไฮแลนด์ แล้วจัดหมวดหมู่ให้ถูกต้อง',
    scotlandClassifyPrompt: 'จัดหมวดหมู่หลักฐานนี้:',
    scotlandStation2Instruction: 'จับคู่ผ้าหรือเครื่องแต่งกายแต่ละแบบกับหน้าที่ทางวัฒนธรรมที่ตรงกัน',
    scotlandMatchPurposePrompt: 'เลือกบทบาทหรือที่มาที่ตรงกัน:',
    scotlandFinalInsightLabel: 'สรุปข้อสังเกตทางวัฒนธรรม',
    scotlandCountryLabel: 'สกอตแลนด์',
    scotlandBothCountriesLabel: 'ทั้งสองประเทศ',
    scotlandThailandLabel: 'ประเทศไทย',
    scotlandStation3Instruction: 'เปิดดูวัตถุดิบอาหารสกอตแต่ละถาด อ่านเบาะแสภูมิอากาศ แล้วเชื่อมโยงกับอาหารไทย',
    scotlandInspectIngredientsButton: 'เปิดดูวัตถุดิบ',
    scotlandFoodComparePrompt: 'เชื่อมโยงอาหารจานนี้กับไทย:',
    scotlandStation4Instruction: 'กดฟังเสียงเครื่องดนตรีสังเคราะห์ ดูจังหวะ แล้วระบุบทบาทในงานเทศกาล',
    scotlandPlaySoundCueButton: 'ฟังเสียงเครื่องดนตรี',
    scotlandIdentifyRolePrompt: 'เครื่องดนตรีนี้มีบทบาทอย่างไรในเทศกาล?',
    scotlandStation5Instruction: 'จัดกลุ่มข้อสังเกตวัฒนธรรมลงบนเข็มทิศ: สกอตแลนด์ ทั้งสองประเทศ หรือไทย',
    scotlandPlaceCompassZonePrompt: 'จัดวางลงบนเข็มทิศเปรียบเทียบ:',
    scotlandLanguageBridgePreviewTitle: 'ตัวอย่างคำเชื่อมเปรียบเทียบ (เตรียมพร้อมสู่ด่าน BUILD)',
    scotlandRouteTabLabel: 'เส้นทางแนะนำ',
    scotlandEvidenceTabLabel: 'การ์ดหลักฐาน',
    scotlandRecommendedNextLabel: 'จุดแนะนำถัดไป',
    scotlandGuideMeButton: 'นำทางไปจุดนี้',
    scotlandGuidingActiveLabel: 'กำลังนำทางอยู่',
    scotlandClearGuideButton: 'หยุดนำทาง',
    scotlandStatusCompleted: 'เก็บครบแล้ว',
    scotlandStatusVisited: 'แวะชมแล้ว',
    scotlandStatusNotVisited: 'ยังไม่เคยแวะ',
    scotlandHudGuidingPrefix: 'กำลังนำทาง',
    scotlandAllStationsDoneNote: 'พิชิตครบทั้ง 5 จุดแล้ว! เปิดทบทวนการ์ดหลักฐานได้ทุกเมื่อ',
    scotlandOpenCardButton: 'เปิดการ์ดหลักฐาน',
    scotlandHotspotMapTitle: 'แตะจุดสังเกตในภาพจัตุรัสหมู่บ้าน แล้วจัดลงกล่องหมวดหมู่ด้านล่าง',
    scotlandBucketsTitle: 'กล่องจัดหมวดหมู่หลักฐาน',
    scotlandWeaveStepTitle: 'ขั้นที่ 1 · กี่ทอผ้าทาร์ทันโต้ตอบ (สลับสีเส้นยืนและเส้นพุ่งแล้วเทียบกับไหมแพรวา)',
    scotlandToggleWarpButton: 'สลับสีเส้นยืน',
    scotlandToggleWeftButton: 'สลับสีเส้นพุ่ง',
    scotlandWeaveCompareContinue: 'ทอผ้าทาร์ทันเสร็จแล้ว — เปิดกระดานจับคู่สิ่งทอ',
    scotlandPairLeftTitle: '1. เลือกการ์ดสิ่งทอ',
    scotlandPairRightTitle: '2. แตะหน้าที่ทางวัฒนธรรมที่ตรงกัน',
    scotlandPantryShelfTitle: '1. ชั้นวัตถุดิบตลาดไฮแลนด์ — เลือกวัตถุดิบสกอตแท้ 3 อย่างใส่ชามผสม',
    scotlandMixingBowlTitle: '2. ชามผสมวัตถุดิบประจำจาน',
    scotlandBowlReadyNote: 'รวบรวมวัตถุดิบสกอตครบ 3 อย่างแล้ว! คราวนี้เชื่อมโยงกับอาหารไทย:',
    scotlandMysteryAudioPrompt: 'กดฟังเสียงปริศนาและสังเกตคลื่นจังหวะด้านล่าง',
    scotlandCompassTrayTitle: '1. เลือกการ์ดข้อสังเกตวัฒนธรรมที่ยังไม่จัดวาง',
    scotlandCompassBoardHint: 'จัดวางบนกระดานเปรียบเทียบแล้ว',
    replayCountryButton: 'เล่นประเทศนี้ซ้ำ',
    restartAttemptButton: 'เริ่มรอบปัจจุบันใหม่',
    replayModeLabel: 'โหมดฝึกซ้อมซ้ำ',
    replayAttemptPrefix: 'รอบที่',
    replayStagePrefix: 'ด่าน',
    replayAttemptCompleteLabel: 'จบรอบฝึกซ้อมแล้ว',
    replayConfirmTitle: 'เริ่มเล่นประเทศนี้ซ้ำจากด่าน DISCOVER?',
    restartConfirmTitle: 'ต้องการเริ่มรอบปัจจุบันใหม่หรือไม่?',
    replayConfirmBody: 'เริ่มต้นรอบฝึกซ้อมใหม่สำหรับประเทศนี้ตั้งแต่ด่านที่ 1 (DISCOVER) เพื่อให้คุณฝึกผ่านแต่ละด่านที่เปิดให้เล่นได้อีกครั้งโดยไม่สูญเสียความคืบหน้าเดิม',
    restartConfirmBody: 'รีเซ็ตเฉพาะรอบฝึกซ้อมที่กำลังเล่นอยู่กลับไปที่ด่านที่ 1 (DISCOVER) ประวัติรอบที่ทำสำเร็จแล้วและรางวัลทั้งหมดยังคงอยู่ครบถ้วน',
    replayPreservedTitle: 'ข้อมูลที่เก็บรักษาไว้ครบถ้วน',
    replayPreservedDetail: 'คะแนน XP เหรียญ อัญมณี ตราประทับพาสปอร์ต ประเทศที่ปลดล็อกแล้ว และประวัติความสำเร็จทั้งหมดจะไม่ถูกลบ (กิจกรรมที่เคยรับ XP แล้วจะไม่เพิ่ม XP ซ้ำ)',
    replayScotlandScopeNote: 'สกอตแลนด์เปิดให้เล่นครบทั้ง 4 ด่านแล้ว: DISCOVER, BUILD, PRACTICE และ PERFORM สามารถฝึกซ้ำได้ตลอดโดยคงคะแนน XP และตราประทับพาสปอร์ตเดิมไว้ครบถ้วน',
    replayConfirmActionButton: 'เริ่มฝึกซ้อมซ้ำจาก DISCOVER',
    restartConfirmActionButton: 'ยืนยันเริ่มรอบใหม่',
    cancelButton: 'ยกเลิก',
    replayNoExtraXpLabel: 'โหมดฝึกซ้อมซ้ำ · คงคะแนน XP เดิม',
    scotlandDiscoverReplayBannerTitle: 'พิชิตด่าน DISCOVER รอบซ้อมสำเร็จ!',
    scotlandBuildStageBadge: 'ด่านที่ 2 · BUILD',
    scotlandObjectiveTalkEilidhBuild: 'คุยกับไอลีดเพื่อเริ่มด่านที่ 2: BUILD',
    scotlandObjectiveBuild: 'สร้างประโยคเปรียบเทียบไทย-สกอตแลนด์ให้ครบ 5 จุด',
    scotlandObjectiveBuildComplete: 'ผ่านด่าน BUILD แล้ว · ปลดล็อกด่าน PRACTICE!',
    scotlandBuildHudLabel: 'สร้างแล้ว',
    scotlandStartBuildButton: 'เริ่มด่าน BUILD — สร้างประโยคเปรียบเทียบ',
    scotlandBuildBannerTitle: 'ผ่านด่านที่ 2 สำเร็จ! รับ +50 XP',
    scotlandBuildReplayBannerTitle: 'พิชิตด่าน BUILD รอบซ้อมสำเร็จ!',
    scotlandBuildBannerSubtitle: 'สร้างประโยคเปรียบเทียบครบทั้ง 5 จุดแล้ว และปลดล็อกด่านที่ 3: PRACTICE เรียบร้อย!',
    scotlandBuildSavedTitle: 'บันทึกประโยคเปรียบเทียบสำเร็จ!',
    scotlandBuildFirstSaveNote: 'บันทึกไว้ใช้ต่อในด่าน PRACTICE แล้ว ทำให้ครบทั้ง 5 จุดเพื่อรับ +50 XP!',
    scotlandBuildReplayNote: 'อัปเดตประโยคแล้ว! เล่นซ้ำเพื่อฝึกได้ตลอด (+0 XP เพิ่ม)',
    scotlandBuildCraftedLabel: 'ประโยคเปรียบเทียบที่สร้างไว้',
    scotlandBuildInspectDiscoverCardButton: 'เปิดทบทวนด่าน DISCOVER',
    scotlandBuildPracticeReadinessNote: 'สร้างประโยคเปรียบเทียบครบทั้ง 5 จุดเพื่อปลดล็อกด่านที่ 3: PRACTICE',
    scotlandBuildSubmitButton: 'ตรวจและบันทึกประโยค',
    scotlandBuildClearTilesButton: 'ล้างคำ',
    scotlandBuildTrySpeakLabel: 'ฟังตัวอย่างและฝึกพูด (ไม่บังคับ)',
    scotlandBuildCheckSpeakingButton: 'ฝึกพูดประโยคนี้',
    scotlandBuildStopListeningButton: 'หยุดไมค์',
    scotlandBuildNoSpeechNote: 'การฝึกพูดเป็นทางเลือก สามารถกดฟังเสียงและไปต่อได้ทันที',
    scotlandJournalBuiltSentenceLabel: 'ประโยคเปรียบเทียบจากด่าน BUILD',
    scotlandPracticeStageBadge: 'ด่านที่ 3 · PRACTICE',
    scotlandPracticeHudLabel: 'สนทนา',
    scotlandObjectiveTalkEilidhPractice: 'คุยกับไอลีดเพื่อเริ่มด่านที่ 3: PRACTICE',
    scotlandObjectivePractice: 'สนทนาแลกเปลี่ยนวัฒนธรรมไฮแลนด์ให้ครบ 5 จุด',
    scotlandObjectivePerformUnlocked: 'จบด่าน PRACTICE แล้ว · ปลดล็อกด่าน PERFORM!',
    scotlandStartPracticeButton: 'เริ่มด่าน PRACTICE — สนทนาแลกเปลี่ยนวัฒนธรรม',
    scotlandPracticeBannerTitle: 'ผ่านด่านที่ 3 สำเร็จ! รับ +50 XP',
    scotlandPracticeReplayBannerTitle: 'พิชิตด่าน PRACTICE รอบซ้อมสำเร็จ!',
    scotlandPracticeBannerSubtitle: 'สนทนาแลกเปลี่ยนวัฒนธรรมครบทั้ง 5 จุดแล้ว และปลดล็อกด่านที่ 4: PERFORM เรียบร้อย!',
    scotlandPracticeReviewBuildButton: 'เปิดทบทวนด่าน BUILD',
    scotlandPracticeDoneBadge: 'สนทนาแล้ว',
    scotlandPracticeStepListen: '1. ฟัง',
    scotlandPracticeStepPrepare: '2. เตรียม',
    scotlandPracticeStepSpeak: '3. พูด',
    scotlandPracticeStepReview: '4. ทบทวน',
    scotlandPracticeStepComplete: '5. สำเร็จ',
    scotlandPracticeStopAudioButton: 'หยุดเสียง',
    scotlandPracticeListenPromptButton: 'ฟังคำถาม',
    scotlandPracticeSpeakPromptNote: 'พูดตอบด้วยคำพูดของคุณเองโดยอ้างอิงข้อมูลจริงของสกอตแลนด์และไทย',
    scotlandPracticeEvidenceLinkHeading: 'ข้อมูลจากสมุดบันทึกวัฒนธรรมของคุณ (ด่าน 1)',
    scotlandPracticeBuildLinkHeading: 'ประโยคเปรียบเทียบที่คุณสร้างไว้ (ด่าน 2 BUILD)',
    scotlandPracticeOtherBuiltHeading: 'ประโยคจากจุดอื่น ๆ ในด่าน BUILD (ช่วยเชื่อมโยง)',
    scotlandPracticeKeyTermsHeading: 'คำศัพท์และวลีเปรียบเทียบสำคัญ',
    scotlandPracticeFramesHeading: 'โครงสร้างประโยคช่วยพูด (เลือกดูได้)',
    scotlandPracticeModelHeading: 'ตัวอย่างคำตอบเปรียบเทียบ',
    scotlandPracticeHideFramesLabel: 'ซ่อนตัวช่วย',
    scotlandPracticeShowFramesLabel: 'แสดงตัวช่วย',
    scotlandPracticeFollowUpBadge: 'คำถามติดตามจากฟิโอนา',
    scotlandPracticeFollowUpInstruction: 'หลังจากตอบคำถามหลักของไอลีดแล้ว ลองอัดเสียงหรือฝึกพูดตอบคำถามติดตามจากฟิโอนา:',
    scotlandPracticeFollowUpNoMicCheck: 'ฉันได้ฝึกพูดตอบคำถามติดตามของฟิโอนาออกเสียงชัดเจนแล้ว',
    scotlandPracticeFollowUpRequiredNote: 'กรุณาอัดเสียงหรือติ๊กยืนยันว่าได้ฝึกพูดตอบคำถามติดตามของฟิโอนาก่อนไปต่อ',
    scotlandPracticeCheckCompare: 'ฉันได้เปรียบเทียบสกอตแลนด์และประเทศไทย',
    scotlandPracticeCheckExample: 'ฉันได้ยกตัวอย่างเฉพาะเจาะจงประกอบ',
    scotlandPracticeCheckSimDiff: 'ฉันได้อธิบายความเหมือนหรือความแตกต่าง',
    scotlandPracticeCheckClear: 'ฉันพยายามพูดออกเสียงให้ชัดเจน',
    scotlandPracticeChecklistHint: 'ติ๊กข้อความที่ตรงกับการฝึกพูดของคุณ (อย่างน้อย 1 ข้อ):',
    scotlandPracticeGuidanceHeading: 'คำแนะนำฝึกพูด (Practice Guidance)',
    scotlandPracticeGuidanceHonestNote: 'ระบบช่วยทบทวนตนเอง — ไม่มีการถอดข้อความหรือให้คะแนนด้วย AI เสียงอยู่ในเครื่องนี้ชั่วคราวเท่านั้น',
    scotlandPracticeListenModelButton: 'ฟังประโยคตัวอย่าง',
    scotlandPracticeSaveCompleteButton: 'บันทึกและจบภารกิจสนทนา',
    scotlandPracticeReturnWorldButton: 'สำรวจไฮแลนด์ต่อ',
    scotlandPracticeNoMicIntro: 'ไม่มีไมโครโฟนหรือปิดใช้งานอยู่ — ฝึกพูดคำตอบภาษาอังกฤษออกเสียงให้ชัดเจน แล้วติ๊กยืนยันด้านล่าง',
    scotlandPracticeNoMicAloudCheck: 'ฉันฝึกพูดออกเสียงชัดเจนแล้ว (I Practiced Aloud)',
    scotlandPracticeAllFiveEarnedNote: 'สนทนาแลกเปลี่ยนวัฒนธรรมครบทั้ง 5 จุดแล้ว! ปลดล็อกด่านที่ 4: PERFORM เรียบร้อย!',
    scotlandPerformStageBadge: 'ด่านที่ 4 · PERFORM',
    scotlandObjectiveStartPerform: 'คุยกับไอลีดหรือไปที่จุดชมวิวปราสาทริมทะเลสาบเพื่อเริ่มด่าน PERFORM',
    scotlandObjectivePerformShowcase: 'นำเสนอแลกเปลี่ยนวัฒนธรรมที่จุดชมวิวปราสาทริมทะเลสาบ',
    scotlandObjectiveScotlandComplete: 'พิชิตภารกิจสกอตแลนด์ครบสมบูรณ์! ได้รับตราประทับพาสปอร์ตแล้ว',
    scotlandPerformHudReady: 'พร้อมขึ้นเวที',
    scotlandPerformHudDone: 'ทูตวัฒนธรรม ✓',
    scotlandStartPerformButton: 'เริ่มด่าน PERFORM — ภารกิจทูตวัฒนธรรมขั้นสุดท้าย',
    scotlandGoLochsideShowcaseButton: 'เปิดเวทีแลกเปลี่ยนวัฒนธรรม',
    scotlandPerformBannerTitle: 'พิชิตสกอตแลนด์สำเร็จ! รับ +100 XP และตราประทับพาสปอร์ต',
    scotlandPerformReplayBannerTitle: 'พิชิตด่าน PERFORM รอบซ้อมสำเร็จ!',
    scotlandPerformBannerSubtitle: 'ปลดล็อกตราประทับพาสปอร์ตไฮแลนด์สกอตแลนด์แล้ว! คุณคือทูตวัฒนธรรมไทย–สกอตแลนด์',
    scotlandPerformTitle: 'Final Cultural Exchange Challenge',
    scotlandPerformMissionBadge: 'ด่านที่ 4 · PERFORM · A2–B1',
    scotlandPerformTargetDuration: 'แนะนำ 60–90 วินาที',
    scotlandPerformLocationLabel: 'Lochside Castle Viewpoint',
    scotlandPerformStepInvitation: 'คำเชิญ',
    scotlandPerformStepPrepare: 'วางแผน',
    scotlandPerformStepSpeech: 'นำเสนอ',
    scotlandPerformStepQa: 'ถาม–ตอบ',
    scotlandPerformStepReflect: 'สะท้อนคิด',
    scotlandPerformInvitationHeading: 'ยินดีต้อนรับสู่เวทีแลกเปลี่ยนวัฒนธรรมริมทะเลสาบ',
    scotlandPerformExpectationsHeading: 'สิ่งที่ต้องเตรียมสำหรับการนำเสนอทูตวัฒนธรรม',
    scotlandPerformListenInstructions: 'ฟังคำแนะนำ',
    scotlandPerformShowThaiSupport: 'แสดงคำอธิบายภาษาไทย',
    scotlandPerformHideThaiSupport: 'ซ่อนคำอธิบายภาษาไทย',
    scotlandPerformStartPrepButton: 'เริ่มวางแผนการพูด',
    scotlandPerformEvidenceHeading: '1. เลือกหลักฐานวัฒนธรรม (อย่างน้อย 2 หัวข้อ)',
    scotlandPerformEvidenceHint: 'เลือกหัวข้อหลักฐานอย่างน้อย 2 ด้านจากการเดินทางของคุณ ประโยคที่คุณสร้างในด่าน BUILD จะแสดงให้ดูเป็นแนวทางด้วย',
    scotlandPerformEvidenceCountLabel: 'หัวข้อที่เลือก',
    scotlandPerformYourBuildQuoteLabel: 'ประโยคจากด่าน 2 BUILD ของคุณ',
    scotlandPerformPlannerHeading: '2. วางโครงเรื่องเปรียบเทียบด้วยตัวคุณเอง (5 ส่วนสั้นๆ)',
    scotlandPerformPlannerHint: 'เขียนโน้ตสั้นๆ ตามความคิดของคุณเอง — กดเพิ่มคำขึ้นต้นได้หากต้องการตัวช่วย',
    scotlandPerformInsertStarterButton: 'เพิ่มคำขึ้นต้น',
    scotlandPerformConnectorsHeading: 'คำเชื่อมเปรียบเทียบสำคัญ (Compare & Contrast)',
    scotlandPerformShowSampleButton: 'ดูตัวอย่างโครงเรื่องอ้างอิง (ไม่บังคับ)',
    scotlandPerformHideSampleButton: 'ซ่อนตัวอย่างอ้างอิง',
    scotlandPerformGoSpeechButton: 'ขึ้นเวทีนำเสนอ',
    scotlandPerformSpeechHeading: 'นำเสนอการแลกเปลี่ยนวัฒนธรรมสกอตแลนด์–ไทย',
    scotlandPerformSpeechSubtitle: 'พูดถ่ายทอดให้ไอลีด ฟิโอนา และผู้ฟังด้วยน้ำเสียงและความคิดของคุณเอง',
    scotlandPerformTimerGuidanceLabel: 'เวลาแนะนำ: 60–90 วินาที (ไม่ตัดจังหวะ สามารถพูดได้ตามจังหวะของคุณ)',
    scotlandPerformToggleNotesButton: 'โน้ตโครงเรื่อง',
    scotlandPerformNoMicAloudCheck: 'ฉันได้นำเสนอการเปรียบเทียบวัฒนธรรมออกเสียงชัดเจนแล้ว',
    scotlandPerformGoQaButton: 'ไปต่อช่วงถาม–ตอบวัฒนธรรม',
    scotlandPerformQaHeading: 'ช่วงถาม–ตอบกับผู้ฟัง (2 คำถาม)',
    scotlandPerformQaIntro: 'ฟังคำถามจากไอลีดและฟิโอนา แล้วอัดเสียงหรือพูดตอบด้วยเหตุผลของคุณเอง',
    scotlandPerformQaDoneBadge: 'ตอบแล้ว',
    scotlandPerformQaNoMicCheck: 'ฉันได้พูดตอบคำถามนี้ด้วยตนเองแล้ว',
    scotlandPerformGoReflectButton: 'ทบทวนและประเมินตนเอง',
    scotlandPerformReflectHeading: 'ฟังทบทวนและสะท้อนการพูดด้วยตนเอง',
    scotlandPerformReflectAudioHeading: 'ฟังเสียงบันทึกของคุณ (เก็บชั่วคราวในเครื่องนี้เท่านั้น)',
    scotlandPerformReflectChecklistPrompt: 'ติ๊กข้อที่คุณได้ปฏิบัติจริงในการนำเสนอครั้งนี้อย่างซื่อสัตย์:',
    scotlandPerformReflectGuidanceTitle: 'คำแนะนำฝึกพูด (Self-Reflection & Practice Guidance)',
    scotlandPerformReflectDisclaimer: 'แบบประเมินตนเองเพื่อการฝึกฝน — ไม่มีการให้คะแนนหรือถอดข้อความด้วย AI เสียงบันทึกจะถูกลบเมื่อปิดหน้าต่างนี้',
    scotlandPerformFinishButton: 'จบภารกิจและรับตราประทับพาสปอร์ต',
    scotlandPerformReplayFinishButton: 'จบรอบฝึกซ้อมด่าน PERFORM',
    scotlandPerformCeremonyBadge: 'ภารกิจแลกเปลี่ยนวัฒนธรรมไทย–สกอตแลนด์เสร็จสมบูรณ์',
    scotlandPerformCeremonyTitle: 'ปลดล็อกตราประทับไฮแลนด์สกอตแลนด์แล้ว!',
    scotlandPerformAmbassadorTitle: 'ทูตวัฒนธรรมสกอตแลนด์–ไทย (Cultural Ambassador)',
    scotlandPerformCeremonySubtitle: 'คุณได้รับ +100 XP (รวมภารกิจสกอตแลนด์ 250 XP) และตราประทับพาสปอร์ตสกอตแลนด์เรียบร้อย!',
    scotlandPerformCeremonyReplaySubtitle: 'จบรอบฝึกซ้อมแล้ว! คะแนน 750 XP ตราประทับพาสปอร์ต และประวัติความสำเร็จเดิมทั้งหมดถูกเก็บรักษาไว้อย่างปลอดภัย',
    scotlandPerformTotalXpNote: 'XP รวมภารกิจสกอตแลนด์ครบทั้ง 4 ด่าน',
    scotlandPerformCumulativeXpNote: 'XP สะสมรวมทุกประเทศ',
    scotlandPerformStayScotlandButton: 'สำรวจไฮแลนด์ต่อ',
    scotlandPerformViewPassportButton: 'เปิดดูพาสปอร์ต',
    scotlandPerformReplayButton: 'เล่นสกอตแลนด์ซ้ำ',
    scotlandLochsideInviteBadge: 'เวทีแลกเปลี่ยนวัฒนธรรมพร้อมแล้ว',
    scotlandLochsideReviewPracticeButton: 'ทบทวนด่าน 3 PRACTICE',
    worldMapAustraliaUnlockHint: 'พิชิตภารกิจสกอตแลนด์ (Highland Heroes) และรับตราประทับพาสปอร์ตสกอตแลนด์เพื่อปลดล็อกออสเตรเลีย',
    australiaBackToSydney: 'กลับสู่อ่าวซิดนีย์',
    arrivingAustraliaTitle: 'กำลังเข้าสู่อ่าวซิดนีย์ ประเทศออสเตรเลีย',
    arrivingAustraliaSubtitle: 'CityTalk Quest · โลกแห่งการสื่อสารด่านที่ 4',
    australiaExploreStageBadge: 'ด่านที่ 1 · DISCOVER',
    australiaObjectiveExplore: 'คุยกับโอลิเวีย พาร์กเกอร์ เพื่อเริ่มภารกิจ CityTalk Discovery ทั้ง 5 จุด',
    australiaObjectiveMeetAllNpcs: 'พิชิตภารกิจ DISCOVER ทั้ง 5 จุดรอบอ่าวซิดนีย์ตามลำดับ',
    australiaObjectiveReadyNextPhase: 'พิชิตด่าน DISCOVER ครบทั้ง 5 จุดแล้ว (+50 XP)! ปลดล็อก BUILD (เปิดเล่นในระยะ 4C)',
    australiaControlsHint: 'เดิน: WASD / ลูกศร · หมุนกล้อง: ลากเมาส์ / Q & E · โต้ตอบ: กด E หรือแตะ · เปิดคู่มือเมืองด้านบน',
    australiaFallback2dNotice: 'กำลังแสดงแผนที่ย่านอ่าวซิดนีย์แบบ 2 มิติ (ตำแหน่ง NPC และแลนด์มาร์กครบทั้ง 5 จุด)',
    australiaCityGuideButton: 'คู่มือนักสำรวจเมือง',
    australiaCityGuideTitle: 'คู่มือนักสำรวจเมืองซิดนีย์ (City Explorer Guide)',
    australiaCityGuideSubtitle: '5 จุดสำรวจริมอ่าว · TO INTERACT (A2–B1)',
    australiaCityGuideTabRoute: 'เส้นทางแนะนำ',
    australiaCityGuideTabDistricts: 'ข้อมูลจุดสำคัญ',
    australiaCityGuideRouteTitle: 'เส้นทางและสถานะภารกิจ CityTalk Discovery',
    australiaCityGuideRouteDesc: 'เดินสำรวจทุกพื้นที่ได้อิสระตลอดเวลา ส่วนมินิเกมด่าน DISCOVER ทั้ง 5 ภารกิจจะปลดล็อกตามลำดับ 1–5',
    australiaCityGuideNextStopBadge: 'จุดแนะนำถัดไป',
    australiaCityGuideAllVisitedNote: 'คุณเดินสำรวจแลนด์มาร์กอ่าวซิดนีย์ครบทั้ง 5 แห่งแล้ว! เช็กความคืบหน้าภารกิจ DISCOVER ด้านล่างได้เลย',
    australiaCityGuideVisitedBadge: 'สำรวจแล้ว',
    australiaCityGuideNotVisitedBadge: 'ยังไม่สำรวจ',
    australiaCityGuideGuideMeButton: 'นำทางฉัน',
    australiaCityGuideGuidingActiveButton: 'กำลังนำทาง',
    australiaCityGuideStopGuideButton: 'ยกเลิกนำทาง',
    australiaCityGuideLanguageFocusLabel: 'หัวใจการสื่อสาร (TO INTERACT)',
    australiaCityGuideCulturalNoteLabel: 'เกร็ดวัฒนธรรมซิดนีย์',
    australiaCityGuidePhaseNote: 'ด่านที่ 1 DISCOVER มอบ +50 XP ครั้งเดียวเมื่อครบ 5 ภารกิจ · ด่าน BUILD / PRACTICE / PERFORM จะมาในระยะ 4C–4E (ตราประทับยังไม่ปลดล็อก)',
    australiaListenDialogue: 'ฟังเสียงพูด',
    australiaNextTipButton: 'ดูคำแนะนำเพิ่ม',
    australiaCloseDialogButton: 'สำรวจต่อ',
    australiaPauseTitle: 'หยุดพักการสำรวจซิดนีย์',
    australiaPauseSubtitle: 'CityTalk Quest · โลกที่ 4 ด่าน DISCOVER',
    australiaResumeButton: 'กลับมาสำรวจต่อ',
    australiaLandmarkPreviewBadge: 'แลนด์มาร์กอ่าวซิดนีย์',
    australiaLandmarkPhase4BNote: 'บันทึกการเยี่ยมชมแล้ว (0 XP ต่อจุด · จบครบ 5 ภารกิจ DISCOVER รับ +50 XP ครั้งเดียว)',
    australiaDiscoverStartButton: 'เริ่มภารกิจ CityTalk Discovery Quest',
    australiaDiscoverStartedToast: 'เริ่มภารกิจ CityTalk Discovery แล้ว! ลุยภารกิจที่ 1 ที่ Circular Quay ได้เลย',
    australiaDiscoverPlayMissionButton: 'เล่นภารกิจ DISCOVER',
    australiaDiscoverReviewMissionButton: 'ทบทวนภารกิจที่ผ่านแล้ว',
    australiaDiscoverCompletedBadge: 'ผ่านภารกิจแล้ว',
    australiaDiscoverPlayableBadge: 'ด่านถัดไปที่เล่นได้',
    australiaDiscoverLockedNeedOlivia: 'คุยกับโอลิเวีย พาร์กเกอร์ ก่อนเพื่อเปิดภารกิจ CityTalk Discovery Quest',
    australiaDiscoverLockedPrevious: 'กรุณาผ่านภารกิจ DISCOVER ก่อนหน้าเพื่อปลดล็อกด่านนี้:',
    australiaDiscoverBuildUnlockedTitle: 'ปลดล็อกด่านที่ 2 BUILD แล้ว',
    australiaDiscoverBuildUnlockedNote: 'ปลดล็อกแล้ว — เปิดให้เล่นในระยะที่ 4C (ตราประทับออสเตรเลียจะได้รับเมื่อจบด่าน PERFORM)',
    australiaDiscoverStageCompleteReward: 'รับ +50 XP · พิชิตด่านที่ 1 DISCOVER สำเร็จ!',
    australiaDiscoverCefrA2Label: 'ระดับ A2 พื้นฐาน',
    australiaDiscoverCefrB1Label: 'ระดับ B1 เชิงลึก',
    australiaDiscoverHearButton: 'ฟังเสียงประโยค',
    australiaDiscoverReplayAudioButton: 'ฟังซ้ำ',
    australiaDiscoverStopAudioButton: 'หยุดเสียง',
    australiaDiscoverHintButton: 'ดูคำใบ้',
    australiaDiscoverHideHintButton: 'ซ่อนคำใบ้',
    australiaDiscoverReshuffleButton: 'สลับตัวเลือกใหม่',
    australiaDiscoverNextChallengeButton: 'ข้อถัดไป',
    australiaDiscoverFinishMissionButton: 'พิชิตภารกิจนี้',
    australiaDiscoverReturnSydneyButton: 'กลับสู่อ่าวซิดนีย์',
    australiaDiscoverFictionalNotice: 'ข้อมูลราคาและตารางเวลาในเกมเป็นตัวอย่างจำลองเพื่อฝึกภาษาอังกฤษเท่านั้น',
    australiaDiscoverCafeTrayTitle: 'ถาดอาหารและใบเสร็จของคุณ',
    australiaDiscoverCafeMenuTitle: 'เมนูจำลอง Harbour Market Café',
    australiaDiscoverBoardTabTimes: 'ตารางเวลา',
    australiaDiscoverBoardTabTickets: 'ราคาบัตรตัวอย่าง',
    australiaDiscoverBoardTabInclusions: 'สิ่งที่รวมในบัตร',
    australiaDiscoverRepairReplyLabel: 'การตอบกลับในบทสนทนาจริง',
    australiaDiscoverCompletedSummaryTitle: 'ค้นพบเคล็ดลับการสื่อสารสำเร็จ!',
    australiaBuildStageBadge: 'ด่านที่ 2 · BUILD',
    australiaBuildObjectiveStart: 'คุยกับโอลิเวีย พาร์กเกอร์ เพื่อเริ่มด่านที่ 2 BUILD สร้างบทสนทนา',
    australiaBuildObjectiveInProgress: 'ประกอบบทสนทนาภาษาอังกฤษให้ครบ 5 จุดหมาย BUILD ตามลำดับ',
    australiaBuildObjectiveReadyNextPhase: 'พิชิตด่าน BUILD ครบ 5 ภารกิจแล้ว (+50 XP)! ด่าน PRACTICE กำลังจะมาเร็ว ๆ นี้',
    australiaBuildStartButton: 'เริ่มด่านที่ 2 BUILD',
    australiaBuildPlayMissionButton: 'เปิดเวิร์กช็อป BUILD',
    australiaBuildReviewMissionButton: 'ฝึกซ้ำ BUILD',
    australiaBuildLockedNeedDiscover: 'กรุณาผ่านด่าน DISCOVER ให้ครบก่อนจึงจะเริ่ม BUILD ได้',
    australiaBuildLockedNeedOlivia: 'คุยกับโอลิเวีย พาร์กเกอร์ เพื่อเปิดภารกิจ BUILD ก่อน',
    australiaBuildLockedPrevious: 'กรุณาผ่านภารกิจ BUILD ก่อนหน้าให้เรียบร้อย:',
    australiaBuildCompletedBadge: 'ประกอบแล้ว',
    australiaBuildPlayableBadge: 'พร้อมฝึกสร้าง',
    australiaBuildPracticeUnlockedTitle: 'ปลดล็อกด่านที่ 3: PRACTICE (เร็ว ๆ นี้)',
    australiaBuildPracticeUnlockedNote: 'คุณได้รับ +50 XP จากการผ่านด่าน BUILD ครบ 5 จุดแล้ว! ด่าน PRACTICE และ PERFORM จะเปิดให้เล่นในเฟสถัดไป',
    australiaBuildXpRewardOnceNote: 'รับโบนัส +50 XP ครั้งเดียวเมื่อผ่านภารกิจ BUILD ครบทั้ง 5 จุด',
    australiaBuildGuideSectionTitle: 'ด่านที่ 2 · BUILD: นักประกอบบทสนทนา',
    australiaBuildGuideSectionDesc: 'ฝึกสร้างบทสนทนาครบ 5 รูปแบบตามลำดับ: 1. ลำดับบทสนทนา -> 2. ถามทางและแผนที่ -> 3. สั่งอาหารคาเฟ่ -> 4. ตั้งคำถามข้อมูล -> 5. แก้ไขความเข้าใจผิด',
    australiaBuildSavedDialogueLabel: 'ตัวอย่างบทสนทนาที่สร้างไว้',
    australiaBuildMoveUpButton: 'เลื่อนขึ้น',
    australiaBuildMoveDownButton: 'เลื่อนลง',
    australiaBuildRemoveCardButton: 'เอาออก',
    australiaBuildUndoTileButton: 'ลบคำล่าสุด',
    australiaBuildClearButton: 'ล้างทั้งหมด',
    australiaBuildCheckAnswerButton: 'ตรวจบทสนทนา',
    australiaBuildSequenceStripTitle: 'ลำดับบทสนทนาของคุณ (บนลงล่าง)',
    australiaBuildSequencePoolTitle: 'การ์ดบทสนทนา (แตะเพื่อเพิ่มลงลำดับ)',
    australiaBuildTileStripTitle: 'ประโยคที่คุณประกอบไว้',
    australiaBuildTilePoolTitle: 'คลังแผ่นคำ (แตะเรียงตามลำดับ)',
    australiaBuildFunctionSelectorTitle: '1. เลือกบทบาทของการสื่อสาร',
    australiaBuildRouteDiagramTitle: '2. แตะหมุดจุดหมายบนแผนที่เส้นทาง',
    australiaBuildCafeTurnsTitle: 'ประกอบคำตอบลูกค้าทั้ง 3 จังหวะ',
    australiaBuildTicketQuestionLabel: '1. สร้างคำถามจากกระดานข้อมูล',
    australiaBuildTicketFollowUpLabel: '2. เลือกประโยคตอบกลับหลังแจ็กอธิบาย',
    australiaBuildRescueStep1Title: 'ขั้นที่ 1 · ระบุสาเหตุของปัญหา',
    australiaBuildRescueStep2Title: 'ขั้นที่ 2 · ต่อประโยคขอให้ช่วยอธิบาย',
    australiaBuildRescueStep3Title: 'ขั้นที่ 3 · เลือกคำตอบรับอย่างสุภาพ',
    australiaBuildHearFullDialogueButton: 'ฟังเสียงตัวอย่างบทสนทนา',
    australiaBuildChallengeCompleteTitle: 'ประกอบบทสนทนาสำเร็จ!',
    australiaBuildNextChallengeButton: 'ทำข้อถัดไป',
    australiaBuildFinishMissionButton: 'พิชิตภารกิจ BUILD',
    australiaBuildModeBadge: 'ด่านที่ 2 · ฝึกประกอบบทสนทนา',
    australiaBuildReviewDiscoverToggle: 'ทบทวนด่าน 1 DISCOVER',
    australiaPracticeStageBadge: 'ด่านที่ 3 · PRACTICE',
    australiaPracticeModeBadge: 'ด่านที่ 3 · ฝึกพูดบทสนทนาโต้ตอบ',
    australiaPracticeObjectiveStart: 'คุยกับโอลิเวีย พาร์กเกอร์ เพื่อเริ่มด่านที่ 3 ฝึกพูดโต้ตอบ',
    australiaPracticeObjectiveInProgress: 'ฝึกพูดบทสนทนากับชาวซิดนีย์ให้ครบทั้ง 5 ภารกิจตามลำดับ',
    australiaPracticeObjectiveReadyNextPhase: 'พิชิตด่าน PRACTICE ครบแล้ว (+50 XP)! ปลดล็อกด่าน PERFORM (เร็ว ๆ นี้)',
    australiaPracticeStartButton: 'เริ่มด่านที่ 3: PRACTICE',
    australiaPracticePlayMissionButton: 'เริ่มฝึกพูด',
    australiaPracticeReviewMissionButton: 'ทบทวนฝึกพูด',
    australiaPracticeCompletedBadge: 'ฝึกพูดแล้ว',
    australiaPracticePlayableBadge: 'ภารกิจพูดถัดไป',
    australiaPracticeLockedNeedOlivia: 'ปลดล็อกด่านที่ 3 แล้ว! คุยกับโอลิเวีย พาร์กเกอร์ (หรือกดเริ่มด้านล่าง) เพื่อเริ่ม PRACTICE',
    australiaPracticeLockedPrevious: 'กรุณาฝึกภารกิจพูดก่อนหน้าให้สำเร็จก่อน:',
    australiaPracticePerformUnlockedTitle: 'ปลดล็อกด่านที่ 4: PERFORM (เร็ว ๆ นี้)',
    australiaPracticePerformUnlockedNote: 'คุณได้รับ +50 XP ครั้งเดียวจากการฝึกพูดครบทั้ง 5 จุดแล้ว! ด่านที่ 4 PERFORM จะเปิดให้เล่นในเฟส 4E',
    australiaPracticeXpRewardOnceNote: 'รับโบนัส +50 XP ครั้งเดียวเมื่อฝึกพูดครบทั้ง 5 ภารกิจ',
    australiaPracticeGuideSectionTitle: 'ด่านที่ 3 · PRACTICE: ภารกิจฝึกพูดในซิดนีย์',
    australiaPracticeGuideSectionDesc: 'ฝึกพูดโต้ตอบหลายจังหวะตามลำดับ 5 จุด: 1. ทักทาย -> 2. ถามทาง -> 3. สั่งคาเฟ่ -> 4. สอบถามข้อมูล -> 5. ซ่อมความเข้าใจ',
    australiaPracticeReviewBuildToggle: 'ทบทวนด่าน 2 BUILD',
    australiaPracticeHelpPointReuseBadge: 'โอลิเวีย · จุดช่วยเหลือสวนฮาร์เบอร์การ์เดนส์',
    australiaPracticeEvidenceBadgeMic: 'บันทึกหลักฐาน · โหมดบันทึกเสียงไมโครโฟน',
    australiaPracticeEvidenceBadgeNoMic: 'บันทึกหลักฐาน · โหมดซ้อมพูด No-Mic',
    australiaPracticeStepListen: '1. ฟัง',
    australiaPracticeStepPrepare: '2. เตรียม',
    australiaPracticeStepSpeak: '3. พูด',
    australiaPracticeStepReview: '4. ทบทวน',
    australiaPracticeStepComplete: '5. สำเร็จ',
    australiaPracticeListenPromptButton: 'ฟังเสียง NPC',
    australiaPracticeStopAudioButton: 'หยุดเสียง',
    australiaPracticeReplayTurnButton: 'ฟังรอบนี้อีกครั้ง',
    australiaPracticeHearClosingButton: 'ฟังคำกล่าวลา',
    australiaPracticeShowStartersButton: 'ดูโครงสร้างประโยค',
    australiaPracticeShowModelButton: 'ดูตัวอย่างคำตอบ',
    australiaPracticeHearModelButton: 'ฟังตัวอย่าง',
    australiaPracticeShowThaiTipButton: 'คำแนะนำภาษาไทย',
    australiaPracticeYourBuiltDialogueLabel: 'ประโยคที่คุณสร้างไว้จากด่าน 2 BUILD',
    australiaPracticeUsefulExpressionsLabel: 'สำนวนที่ควรลองใช้',
    australiaPracticeStartMicButton: 'เริ่มบันทึกเสียงด้วยไมค์',
    australiaPracticeStopMicButton: 'หยุดบันทึกเสียง',
    australiaPracticeRecordingActiveLabel: 'กำลังบันทึกเสียงชั่วคราวในเครื่อง...',
    australiaPracticePlaybackButton: 'ฟังเสียงที่บันทึกไว้',
    australiaPracticeStopPlaybackButton: 'หยุดเล่นเสียง',
    australiaPracticeRetryRecordingButton: 'อัดเสียงรอบนี้ใหม่',
    australiaPracticeAcceptTurnButton: 'ยืนยันรอบนี้และไปต่อ',
    australiaPracticeSwitchNoMicButton: 'สลับไปโหมดซ้อมพูด No-Mic',
    australiaPracticeSwitchMicButton: 'ลองใช้โหมดบันทึกเสียงไมโครโฟน',
    australiaPracticeNoMicTitle: 'โหมดซ้อมพูด No-Mic (ฝึกพูดออกเสียง)',
    australiaPracticeNoMicNotice: 'โหมดนี้ไม่มีการบันทึกเสียงจากไมโครโฟน ให้อ่านสถานการณ์แล้วพูดคำตอบออกเสียงให้ชัดเจน จากนั้นกดยืนยัน',
    australiaPracticeNoMicConfirmCheck: 'ฉันได้ฝึกพูดออกเสียงคำตอบสำหรับรอบนี้แล้ว',
    australiaPracticeMicPrivacyNote: 'ไฟล์เสียงจะเก็บในหน่วยความจำชั่วคราวเฉพาะรอบนี้เท่านั้น และลบอัตโนมัติเมื่ออัดใหม่หรือปิดหน้าต่าง',
    australiaPracticeMicErrorDenied: 'ไม่ได้รับอนุญาตให้ใช้ไมโครโฟน สามารถสลับไปโหมดซ้อมพูด No-Mic ด้านล่างเพื่อฝึกต่อได้ทันที',
    australiaPracticeMicErrorNotFound: 'ไม่พบอุปกรณ์ไมโครโฟน กรุณาสลับไปโหมดซ้อมพูด No-Mic ด้านล่าง',
    australiaPracticeMicErrorUnsupported: 'เบราว์เซอร์นี้ไม่รองรับการอัดเสียงสด กรุณาใช้โหมดซ้อมพูด No-Mic ด้านล่าง',
    australiaPracticeMicErrorUnknown: 'การบันทึกเสียงขัดข้อง ลองอัดใหม่หรือใช้โหมดซ้อมพูด No-Mic ด้านล่าง',
    australiaPracticeRecordingDeferredNotice: 'กรุณาหยุดบันทึกเสียงก่อนเปลี่ยนภาษาหรือระดับ A2/B1',
    australiaPracticeProceedPrepareButton: 'เตรียมประโยคก่อนพูด',
    australiaPracticeProceedSpeakButton: 'เริ่มฝึกพูดโต้ตอบ',
    australiaPracticeProceedReviewButton: 'ไปยังขั้นทบทวนตนเอง',
    australiaPracticeBackToPrepareButton: 'กลับไปเตรียมประโยค',
    australiaPracticeReviewTitle: 'ทบทวนด้วยตนเองและเช็กลิสต์การพูด',
    australiaPracticeReviewDisclaimer: 'บันทึกการฝึกตามจริง: ระบบไม่สร้างข้อความถอดเสียงปลอม หรือคะแนน AI การออกเสียง/ความคล่องแคล่วอัตโนมัติ',
    australiaPracticeSelectAtLeastOneCheck: 'กรุณาติ๊กเช็กลิสต์อย่างน้อย 1 ข้อเพื่อจบภารกิจฝึกพูดนี้',
    australiaPracticeCompleteMissionButton: 'จบภารกิจฝึกพูด',
    australiaPracticeCompletedTitle: 'จบภารกิจฝึกพูดสำเร็จ!',
    australiaPracticeReplayMissionButton: 'ฝึกภารกิจนี้อีกครั้ง',
    australiaPracticeReturnCityButton: 'กลับสู่ซิดนีย์',
    australiaPracticeTurnProgressLabel: 'รอบที่',
    australiaPracticeNpcRepliedBadge: 'ฟังคำตอบ NPC แล้ว',
    australiaPracticeMenuQuickRefTitle: 'เมนูอ้างอิง Harbour Café',
    australiaPracticeBoardQuickRefTitle: 'บอร์ดข้อมูลท่องเที่ยว Darling Harbour',
    australiaPerformStageBadge: 'ด่านที่ 4 · PERFORM',
    australiaCompletedStageBadge: 'พิชิตซิดนีย์ครบแล้ว',
    australiaPerformObjectiveStart: 'คุยกับโอลิเวียเพื่อเริ่มด่านที่ 4: Final Sydney CityTalk Challenge (+100 XP & ตราประทับ)',
    australiaPerformObjectiveInProgress: 'พิชิตภารกิจโต้ตอบอิสระทั้ง 5 จุดในซิดนีย์ตามลำดับ',
    australiaPerformObjectiveReflection: 'ครบทั้ง 5 ภารกิจแล้ว · ทำแบบสะท้อนคิดสรุปท้ายบทเพื่อรับ +100 XP & ตราประทับซิดนีย์!',
    australiaPerformObjectiveCompleted: 'พิชิตออสเตรเลียครบแล้ว · The Sydney Communication Ambassador (ปลดล็อกอียิปต์)',
    australiaPerformStartButton: 'เริ่มบททดสอบสุดท้ายซิดนีย์',
    australiaPerformPlayChallengeButton: 'เล่นบททดสอบสุดท้าย',
    australiaPerformReviewChallengeButton: 'ทบทวนบททดสอบ',
    australiaPerformStartReflectionButton: 'ทำแบบสะท้อนคิดและรับตราประทับ',
    australiaPerformViewCelebrationButton: 'ดูใบประกาศและตราประทับซิดนีย์',
    australiaPerformGuideSectionTitle: 'ด่านที่ 4 PERFORM — Final Sydney CityTalk Challenge',
    australiaPerformGuideSectionDesc: 'สื่อสารภาษาอังกฤษในสถานการณ์จริง 5 จุดแบบลดตัวช่วย แล้วทำแบบสะท้อนคิดท้ายบทเพื่อรับ +100 XP และตราประทับซิดนีย์',
    australiaPerformLockedNeedOlivia: 'คุยกับโอลิเวีย พาร์กเกอร์ ที่ Circular Quay ก่อนเริ่มด่านที่ 4 PERFORM',
    australiaPerformLockedPrevious: 'กรุณาพิชิตบททดสอบก่อนหน้านี้ก่อน:',
    australiaPerformCompletedBadge: 'ผ่านบททดสอบแล้ว',
    australiaPerformPlayableBadge: 'พร้อมเข้าสู่บททดสอบ',
    australiaPerformMissionBadge: 'ด่านที่ 4 PERFORM · หนึ่งวันในซิดนีย์',
    australiaPerformStepBriefing: '1. เตรียมความเข้าใจ',
    australiaPerformStepInteract: '2. โต้ตอบ',
    australiaPerformStepRespond: '3. ตอบกลับ',
    australiaPerformStepReview: '4. ทบทวน',
    australiaPerformStepComplete: '5. สำเร็จ',
    australiaPerformBeginChallengeButton: 'เริ่มการสนทนา',
    australiaPerformProceedRespondButton: 'ถึงตาคุณตอบกลับ',
    australiaPerformProceedReviewButton: 'ไปยังขั้นทบทวน',
    australiaPerformBackToInteractButton: 'กลับไปดูบทสนทนา',
    australiaPerformShowBuildScriptButton: 'เปิดดูสคริปต์ด่าน 2 BUILD',
    australiaPerformHideBuildScriptButton: 'ซ่อนสคริปต์ด่าน 2 BUILD',
    australiaPerformBuildScriptLabel: 'สคริปต์ที่สร้างไว้ในด่าน 2 BUILD',
    australiaPerformVocabToggleLabel: 'คำศัพท์ที่ช่วยได้',
    australiaPerformStartersToggleLabel: 'โครงสร้างประโยคตัวช่วย (ไม่บังคับ)',
    australiaPerformStrategyToggleLabel: 'กลยุทธ์การสื่อสาร',
    australiaPerformHintToggleShow: 'ต้องการคำแนะนำ? เปิดดู Hint',
    australiaPerformHintToggleHide: 'ซ่อน Hint',
    australiaPerformReflectionHeading: 'Final Guided Reflection — สรุปประสบการณ์หนึ่งวันในซิดนีย์',
    australiaPerformReflectionSubtitle: 'สะท้อนการเรียนรู้จากการสื่อสารทั้ง 5 จุดในซิดนีย์ก่อนรับตราประทับ Ambassador',
    australiaPerformReflectionRequiredNote: 'กรุณาเลือกคำตอบให้ครบทั้ง 5 หัวข้อเพื่อจบภารกิจสุดท้าย',
    australiaPerformFinishReflectionButton: 'จบภารกิจออสเตรเลียและรับตราประทับ',
    australiaPerformFinishReplayButton: 'จบรอบเล่นซ้ำออสเตรเลีย',
    australiaPerformSummaryTitle: 'ผลสะท้อนการสื่อสารในซิดนีย์',
    australiaPerformCelebrationBadge: 'พิชิตออสเตรเลียครบทุกด่าน',
    australiaPerformAmbassadorTitle: 'The Sydney Communication Ambassador',
    australiaPerformCelebrationSubtitle: 'คุณพิชิตภารกิจ CityTalk Quest ครบทั้ง 4 ด่านทั่วอ่าวซิดนีย์ และได้รับตราประทับดวงที่ 4 แล้ว!',
    australiaPerformCelebrationReplaySubtitle: 'จบรอบเล่นซ้ำเรียบร้อย! ค่า XP สะสม ตราประทับ และสิทธิ์ปลดล็อกอียิปต์ยังคงอยู่อย่างปลอดภัย',
    australiaPerformTotalXpNote: 'คะแนนรวมออสเตรเลีย 4 ด่าน',
    australiaPerformCumulativeXpNote: 'คะแนนรวมนักสำรวจโลก',
    australiaPerformViewPassportButton: 'เปิดดูพาสปอร์ต',
    australiaPerformReturnMapButton: 'กลับสู่แผนที่โลก',
    australiaPerformReplayCountryButton: 'เล่นออสเตรเลียซ้ำอีกครั้ง',
    australiaPerformStaySydneyButton: 'อยู่สำรวจซิดนีย์ต่อ',
    australiaPerformGoldenToastTitle: 'พิชิตออสเตรเลียสำเร็จ · ได้รับตราประทับซิดนีย์!',
    australiaPerformGoldenToastBody: 'รับ +100 XP · คะแนนรวมครบ 1,000 XP · ปลดล็อกบทอียิปต์ (Coming Soon) แล้ว!',
    australiaPerformReviewPromptLabel: 'การประเมินตนเอง',
    australiaPerformNoAutoAnswerNote: 'โหมดอิสระ PERFORM: ระบบจะไม่แสดงเฉลยเต็มโดยอัตโนมัติ จนกว่าคุณจะกดขอคำใบ้',
    australiaPerformReflectionGateNotice:
      'เหลืออีกหนึ่งขั้นตอน! ทำแบบประเมินตนเองให้เสร็จเพื่อจบภารกิจประเทศออสเตรเลียและปลดล็อกประเทศถัดไป',
    australiaPerformCompleteReflectionButton: 'ทำแบบประเมินตนเองให้เสร็จ',
    australiaPerformResumeReflectionButton: 'ทำแบบประเมินตนเองต่อ',
    worldMapAustraliaReflectionPendingHint:
      'เหลืออีกหนึ่งขั้นตอน! ทำแบบประเมินตนเองให้เสร็จเพื่อจบภารกิจประเทศออสเตรเลียและปลดล็อกประเทศถัดไป',
    navGoToNextMission: 'ไปภารกิจถัดไป',
    navPlacesButton: 'จุดหมาย',
    navAutoWalkButton: 'เดินอัตโนมัติ',
    navQuickTravelButton: 'วาร์ปด่วน',
    navCancelWalkButton: 'ยกเลิก',
    navClearDestinationButton: 'ล้างจุดหมาย',
    navGuideOnlyButton: 'นำทางแสงไฟ',
    navWalkingToPrefix: 'กำลังเดินไปยัง',
    navArrivedAtPrefix: 'ถึงจุดหมายแล้ว:',
    navQuickTravelArrivedPrefix: 'วาร์ปมาถึงแล้ว:',
    navAlreadyNearbyPrefix: 'คุณอยู่ใกล้จุดนี้แล้ว:',
    navCancelledManual: 'หยุดเดินอัตโนมัติเพื่อควบคุมด้วยตนเอง',
    navCancelledPrefix: 'ยกเลิกการนำทางแล้ว',
    navUnreachable: 'ไม่พบเส้นทางเดินที่ปลอดภัยไปยังจุดนี้',
    navComingSoonAustraliaBuild: 'ด่านที่ 2 BUILD กำลังจะมาเร็ว ๆ นี้! คุณผ่านด่าน DISCOVER แล้ว',
    navComingSoonAustraliaPractice: 'ด่านที่ 3 PRACTICE กำลังจะมาเร็ว ๆ นี้! คุณผ่านด่าน BUILD ครบแล้ว (+50 XP)',
    navComingSoonAustraliaPerform: 'ด่านที่ 4 PERFORM กำลังจะมาเร็ว ๆ นี้! คุณผ่านด่าน PRACTICE ครบแล้ว (+50 XP)',
    navCountryCompletedNote: 'พิชิตภารกิจครบทุกด่านในประเทศนี้แล้ว! เลือกลงจุดต่าง ๆ เพื่อทบทวนได้ตลอดเวลา',
    navRecommendedBadge: 'ถัดไป',
    navPlacesMenuTitle: 'ระบบนำทางอัจฉริยะ',
    navPlacesMenuSubtitle: 'เดินอัตโนมัติตามทางปลอดภัย · วาร์ปด่วนถึงจุดสำคัญทันที',
    navZeroRewardHint: 'ทางลัดการเดินทาง · 0 XP / ไม่ปลดล็อกด่านข้ามขั้น',
    navStatusCompleted: 'ผ่านแล้ว',
    navStatusVisited: 'สำรวจแล้ว',
    navStatusOpen: 'พร้อมสำรวจ',
    navNoNextMissionNote: 'ยังไม่มีภารกิจถัดไปที่ต้องดำเนินการในขณะนี้',
    worldMapEgyptUnlockHint: 'พิชิตภารกิจออสเตรเลีย (CityTalk Quest) และรับตราประทับซิดนีย์เพื่อปลดล็อกอียิปต์',
    worldMapEgyptEnterableBadge: 'ด่าน 1 · DISCOVER เปิดเล่นแล้ว',
    worldMapEgyptEnterableHint: 'ด่านที่ 1 DISCOVER ของอียิปต์ ("ความลับแห่งฟาโรห์") เปิดให้เล่นแล้ว! พิชิตครบ 5 เกมรับ +50 XP',
    egyptBackToGiza: 'กลับสู่ค่ายสำรวจอียิปต์',
    arrivingEgyptTitle: 'เดินทางถึงที่ราบสูงกีซาและริมแม่น้ำไนล์',
    arrivingEgyptSubtitle: 'Echoes of Egypt · ความลับที่สาบสูญแห่งฟาโรห์',
    egyptExploreStageBadge: 'ด่าน 1 · DISCOVER',
    egyptObjectiveExplore: 'เดินสำรวจค่ายไนล์และลานกีซาเพื่อพิชิตภารกิจคำสั่ง Stage 1 DISCOVER ทั้ง 5 จุด',
    egyptObjectiveMeetAllNpcs: 'คุยกับ ดร.ไลลา ฮัสซัน ที่ค่ายริมแม่น้ำไนล์เพื่อเริ่มด่านที่ 1: DISCOVER',
    egyptObjectiveAllSitesVisited: 'พิชิตด่าน DISCOVER ครบแล้ว (+50 XP)! คุยกับ ดร.ไลลา เพื่อเริ่มด่านที่ 2: BUILD',
    egyptControlsHint: 'เดิน: WASD / ลูกศร · หมุนกล้อง: ลากเมาส์ / Q และ R · โต้ตอบ: กด E หรือแตะ · เปิดคู่มือด้านบน',
    egyptFallback2dNotice: 'กำลังแสดงแผนที่สำรวจอียิปต์แบบ 2 มิติ (มีสถานที่ 5 แห่ง นักสำรวจ 4 คน แม่น้ำไนล์ และเส้นทางครบถ้วน)',
    egyptGuideButton: 'คู่มือคณะสำรวจ',
    egyptGuideTitle: 'คู่มือคณะสำรวจโบราณคดีอียิปต์',
    egyptGuideSubtitle: '5 จุดสำรวจ · TO GIVE INSTRUCTIONS (A2–B1)',
    egyptGuideTabRoute: 'เส้นทางสำรวจ',
    egyptGuideTabSites: 'บันทึกสถานที่',
    egyptGuideTabStages: 'ด่านและภารกิจ',
    egyptGuideRouteTitle: 'เส้นทางภารกิจอียิปต์ (จุดที่ 1 → 5)',
    egyptGuideRouteDesc: 'ทำภารกิจตามลำดับตั้งแต่ค่ายริมไนล์ถึงหน้าโถงแห่งปัญญาในแต่ละด่าน',
    egyptGuideNextStopBadge: 'จุดถัดไป',
    egyptGuideAllVisitedNote: 'พิชิตครบทุกจุดแล้ว! กดทบทวนหรือเปิดดูสมุด "คำสั่งของฉัน" ได้ตลอดเวลา',
    egyptGuideVisitedBadge: 'สำรวจแล้ว',
    egyptGuideNotVisitedBadge: 'ยังไม่สำรวจ',
    egyptGuideGuideMeButton: 'นำทางแสงไฟ',
    egyptGuideGuidingActiveButton: 'กำลังนำทาง',
    egyptGuideStopGuideButton: 'ยกเลิกนำทาง',
    egyptGuideLanguageFocusLabel: 'หัวใจการสื่อสาร (TO GIVE INSTRUCTIONS)',
    egyptGuideCulturalNoteLabel: 'เกร็ดประวัติศาสตร์และโบราณคดี',
    egyptGuideFutureStagesNote: 'ด่านที่ 1 (DISCOVER) และด่านที่ 2 (BUILD) เปิดให้เล่นแล้ว (รับด่านละ +50 XP) ส่วนด่านที่ 3–4 จะเปิดในเฟสถัดไป',
    egyptGuideStageDiscoverTitle: 'ด่านที่ 1 · DISCOVER — ความลับแห่งฟาโรห์',
    egyptGuideStageDiscoverDesc: 'เรียนรู้คำสั่ง อุปกรณ์ เส้นทาง การเรียงลำดับ และกฎอนุรักษ์ผ่าน 5 มินิเกมโต้ตอบ',
    egyptGuideStageBuildTitle: 'ด่านที่ 2 · BUILD — นักสร้างคำสั่งแห่งอารยธรรมโบราณ',
    egyptGuideStageBuildDesc: 'สร้างคำสั่งจัดกระเป๋า จำลองเส้นทางกีซา เขียนม้วนปาปิรุส ป้ายกฎวิหาร และแปลนภารกิจหลักของฟาโรห์',
    egyptGuideStagePracticeTitle: 'ด่านที่ 3 · PRACTICE — ฝึกพูดแนะนำและบอกทางทีมสำรวจ',
    egyptGuideStagePracticeDesc: 'ฝึกพูดออกคำสั่งหลายขั้นตอนอย่างชัดเจนรอบลานกีซาและวิหารแห่งดวงอาทิตย์',
    egyptGuideStagePerformTitle: 'ด่านที่ 4 · PERFORM — ไขประตูโถงแห่งปัญญา',
    egyptGuideStagePerformDesc: 'นำทีมบรรยายสรุปขั้นตอนการสำรวจรอบสุดท้ายเพื่อเปิดโถงแห่งปัญญาและรับตราประทับอียิปต์',
    egyptGuideComingSoonPhase5B: 'เปิดเล่นแล้ว',
    egyptGuideLockedFuturePhase: 'เร็ว ๆ นี้',
    egyptGuideZeroXpExplorationNote: 'แต่ละเวิร์กชอป +0 XP · พิชิตครบ 5 จุดรับโบนัส +50 XP ครั้งเดียว',
    egyptListenDialogue: 'ฟังเสียงพูด',
    egyptReplayDialogue: 'ฟังซ้ำ',
    egyptStopAudio: 'หยุดเสียง',
    egyptNextTipButton: 'เกร็ดแนะนำ',
    egyptCloseDialogButton: 'ออกสำรวจต่อ',
    egyptPauseTitle: 'หยุดพักการสำรวจอียิปต์',
    egyptPauseSubtitle: 'Echoes of Egypt · ด่านที่ 1 DISCOVER',
    egyptResumeButton: 'กลับมาสำรวจต่อ',
    egyptLandmarkBadge: 'จุดสำรวจโบราณคดีอียิปต์',
    egyptChamberSealedBadge: 'ปิดผนึก · ต้องผ่านภารกิจสำรวจขั้นสุดท้าย',
    egyptChamberSealedBanner: 'ประตูศิลาที่ปิดผนึก — เล่นเกมที่ 5 ด้านหน้าประตู และพิชิตด่าน BUILD, PRACTICE, PERFORM ในเฟสถัดไปเพื่อปลดล็อกด้านใน',
    egyptFictionalVsHistoricalLabel: 'ความแตกต่างระหว่างประวัติศาสตร์จริงและเรื่องราวในเกม',
    egyptZeroXpExploreNote: 'บันทึกการเยี่ยมชมสถานที่แล้ว (+0 XP สำหรับการเดินสำรวจ)',
    egyptHudSitesLabel: 'สถานที่',
    egyptHudNpcsLabel: 'ผู้นำทาง',
    egyptHudGuidingPrefix: 'นำทาง',
    egyptSpeakWithPrefix: 'คุยกับ',
    egyptExploreSitePrefix: 'สำรวจ',
    egyptNileWaterBoundaryToast: 'เดินสำรวจอย่างปลอดภัยบนท่าน้ำไม้และคันหินริมแม่น้ำไนล์!',
    egyptChamberSealedDoorToast: 'ประตูโถงแห่งปัญญายังคงปิดผนึกจนกว่าจะถึงด่านสุดท้าย — เล่นเกมที่ 5 ด้านหน้าประตูได้เลย!',
    egyptDiscoverStageBadge: 'DISCOVER · ด่านที่ 1',
    egyptDiscoverPlayMissionButton: 'เล่นภารกิจนี้',
    egyptDiscoverReviewMissionButton: 'เล่นทบทวน',
    egyptDiscoverCompletedBadge: 'ผ่านด่านนี้แล้ว',
    egyptDiscoverLockedNeedLayla: 'คุยกับ ดร.ไลลา ฮัสซัน ที่ค่ายริมไนล์ (หรือกดเริ่มด่าน DISCOVER) เพื่อปลดล็อกเกมที่ 1',
    egyptDiscoverLockedPrevious: 'กรุณาผ่านภารกิจก่อนหน้าก่อน:',
    egyptDiscoverViaGuideTipNote: 'นำทางผ่านเคล็ดลับประจำสถานที่',
    egyptDiscoverCefrA2Label: 'ระดับ A2',
    egyptDiscoverCefrB1Label: 'ระดับ B1',
    egyptDiscoverCefrSwitchNotice: 'การสลับ A2/B1 จะรีเซ็ตเฉพาะข้อปัจจุบันเพื่อให้คำตอบตรงระดับที่เลือก',
    egyptDiscoverHearButton: 'ฟังคำสั่ง',
    egyptDiscoverReplayAudioButton: 'ฟังซ้ำ',
    egyptDiscoverStopAudioButton: 'หยุดเสียง',
    egyptDiscoverHintButton: 'ดูคำใบ้',
    egyptDiscoverNextHintButton: 'คำใบ้เพิ่มเติม',
    egyptDiscoverCheckButton: 'ตรวจคำตอบ',
    egyptDiscoverUndoButton: 'ย้อนกลับ',
    egyptDiscoverResetButton: 'เริ่มใหม่',
    egyptDiscoverNextChallengeButton: 'ข้อถัดไป',
    egyptDiscoverFinishStationButton: 'จบภารกิจจุดนี้',
    egyptDiscoverReturnGizaButton: 'กลับสู่ลานกีซา',
    egyptDiscoverReplayStationButton: 'ฝึกอีกครั้ง',
    egyptDiscoverStageCompleteTitle: 'พิชิตภารกิจความลับแห่งฟาโรห์ — DISCOVER สำเร็จแล้ว!',
    egyptDiscoverStageCompleteReward: 'รับ +50 XP · ผ่านครบทั้ง 5 จุดเรียนรู้คำสั่งแล้ว',
    egyptDiscoverKnowledgeSealTitle: 'ตราสัญลักษณ์ความรู้คณะสำรวจ (ของตกแต่ง)',
    egyptDiscoverKnowledgeSealNote: 'ตราสัญลักษณ์ประจำด่าน 1 (ยังไม่นับเป็นตราประทับพาสปอร์ต — รับตราอียิปต์จริงเมื่อจบด่าน 4 PERFORM)',
    egyptDiscoverBuildComingSoonTitle: 'ด่านที่ 2 · BUILD — เร็ว ๆ นี้',
    egyptDiscoverBuildComingSoonDesc: 'ตัวอย่างบทถัดไป: ฝึกประกอบและเขียนคำสั่งภาษาอังกฤษทีละขั้นตอนด้วยตนเอง',
    egyptDiscoverZeroXpStationNote: '+0 XP ต่อเกมย่อย · รับ +50 XP ครั้งเดียวเมื่อจบครบทั้ง 5 เกมในด่าน DISCOVER',
    egyptDiscoverStageIntroLabel: 'คำชี้แจงด่านที่ 1 · TO GIVE INSTRUCTIONS',
    egyptDiscoverStationsProgressLabel: 'จุดเรียนรู้ DISCOVER',
    egyptDiscoverAvailableBadge: 'พร้อมเล่น',
    egyptDiscoverLockedBadge: 'ล็อกอยู่',
    egyptDiscoverBuildPreviewBadge: 'เปิดต่อหลังจบ DISCOVER',
    egyptBuildStageBadge: 'BUILD · ด่านที่ 2',
    egyptBuildIntroLabel: 'คำชี้แจงด่านที่ 2 · ANCIENT INSTRUCTION BUILDER',
    egyptBuildStationsProgressLabel: 'เวิร์กชอป BUILD',
    egyptBuildPlayWorkshopButton: 'เริ่มเวิร์กชอป BUILD',
    egyptBuildReviewWorkshopButton: 'ทบทวนเวิร์กชอป',
    egyptBuildCompletedBadge: 'ผ่านเวิร์กชอปแล้ว',
    egyptBuildLockedNeedDiscover: 'กรุณาพิชิตด่านที่ 1: DISCOVER ให้ครบทั้ง 5 จุดก่อนเพื่อปลดล็อกด่าน BUILD',
    egyptBuildLockedNeedLayla: 'คุยกับ ดร.ไลลา ฮัสซัน (หรือกดเริ่มด่าน BUILD) เพื่อรับบทบาทผู้ช่วยคณะสำรวจ',
    egyptBuildLockedPrevious: 'กรุณาผ่านเวิร์กชอปก่อนหน้าก่อน:',
    egyptBuildTestRouteButton: 'ทดสอบเส้นทาง',
    egyptBuildCheckSignButton: 'ตรวจป้ายกฎวิหาร',
    egyptBuildVerifyScrollButton: 'ตรวจม้วนคำสั่ง',
    egyptBuildSaveBlueprintButton: 'ตรวจแปลนภารกิจหลัก',
    egyptBuildStageCompleteTitle: 'พิชิตภารกิจนักสร้างคำสั่ง — BUILD สำเร็จแล้ว!',
    egyptBuildStageCompleteReward: '+50 XP · ผ่านครบทั้ง 5 เวิร์กชอปสร้างคำสั่งแล้ว',
    egyptBuildBuilderSealTitle: 'ตราสัญลักษณ์ผู้ช่วยคณะสำรวจ (ของตกแต่ง)',
    egyptBuildBuilderSealNote: 'ตราสัญลักษณ์ประจำด่าน 2 (ยังไม่นับเป็นตราพาสปอร์ต — รับตราอียิปต์จริงเมื่อจบด่าน 4 PERFORM)',
    egyptBuildPracticeComingSoonTitle: 'ด่านที่ 3 · PRACTICE — เร็ว ๆ นี้',
    egyptBuildPracticeComingSoonDesc: 'ตัวอย่างบทถัดไป: ฝึกพูดและสวมบทบาทออกคำสั่งภาษาอังกฤษในสถานการณ์จริง',
    egyptBuildZeroXpStationNote: '+0 XP ต่อเวิร์กชอป · รับ +50 XP ครั้งเดียวเมื่อจบครบทั้ง 5 เวิร์กชอปในด่าน BUILD',
    egyptBuildOpenJournalButton: 'คำสั่งของฉัน',
    egyptJournalTabLabel: 'คำสั่งของฉัน',
    egyptJournalTitle: 'สมุดบันทึกคำสั่งคณะสำรวจ (My Expedition Instructions)',
    egyptJournalSubtitle: 'รวบรวมประโยคภาษาอังกฤษที่คุณสร้างผ่านในด่าน BUILD (พร้อมใช้ฝึกพูดในด่าน PRACTICE)',
    egyptJournalEmptyState: 'ยังไม่มีคำสั่งที่บันทึกไว้ พิชิตโจทย์ในด่านที่ 2: BUILD เพื่อเก็บประโยคของคุณไว้ที่นี่!',
    egyptJournalRevisionPolicyNote: 'นโยบายการอัปเดต: การเล่นซ้ำข้อเดิมจะอัปเดตข้อความล่าสุดในบันทึกข้อนั้นโดยไม่ซ้ำซ้อน',
    egyptJournalListenButton: 'ฟังเสียง',
    egyptJournalBlueprintPreviewTitle: 'ตัวอย่างแปลนภารกิจหลักฉบับสมบูรณ์',
  },
};

