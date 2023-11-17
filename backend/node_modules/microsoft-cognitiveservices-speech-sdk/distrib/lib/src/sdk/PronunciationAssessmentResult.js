// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
/* eslint-disable max-classes-per-file */
import { Contracts } from "./Contracts.js";
import { PropertyId } from "./Exports.js";
export class ContentAssessmentResult {
    /**
     * @Internal
     * Do not use externally.
     */
    constructor(detailResult) {
        this.privPronJson = detailResult;
    }
    /**
     * Correctness in using grammar and variety of sentence patterns.
     * Grammatical errors are jointly evaluated by lexical accuracy,
     * grammatical accuracy and diversity of sentence structures.
     * @member ContentAssessmentResult.prototype.grammarScore
     * @function
     * @public
     * @returns {number} Grammar score.
     */
    get grammarScore() {
        return this.privPronJson.ContentAssessment.GrammarScore;
    }
    /**
     * Proficiency in lexical usage. It evaluates the speaker's effective usage
     * of words and their appropriateness within the given context to express
     * ideas accurately, as well as level of lexical complexity.
     * @member ContentAssessmentResult.prototype.vocabularyScore
     * @function
     * @public
     * @returns {number} Vocabulary score.
     */
    get vocabularyScore() {
        return this.privPronJson.ContentAssessment.VocabularyScore;
    }
    /**
     * Level of understanding and engagement with the topic, which provides
     * insights into the speaker’s ability to express their thoughts and ideas
     * effectively and the ability to engage with the topic.
     * @member ContentAssessmentResult.prototype.topicScore
     * @function
     * @public
     * @returns {number} Topic score.
     */
    get topicScore() {
        return this.privPronJson.ContentAssessment.TopicScore;
    }
}
/**
 * Pronunciation assessment results.
 * @class PronunciationAssessmentResult
 * Added in version 1.15.0.
 */
export class PronunciationAssessmentResult {
    constructor(jsonString) {
        const j = JSON.parse(jsonString);
        Contracts.throwIfNullOrUndefined(j.NBest[0], "NBest");
        this.privPronJson = j.NBest[0];
    }
    /**
     * @member PronunciationAssessmentResult.fromResult
     * @function
     * @public
     * @param {RecognitionResult} result The recognition result.
     * @return {PronunciationAssessmentConfig} Instance of PronunciationAssessmentConfig
     * @summary Creates an instance of the PronunciationAssessmentResult from recognition result.
     */
    static fromResult(result) {
        Contracts.throwIfNullOrUndefined(result, "result");
        const json = result.properties.getProperty(PropertyId.SpeechServiceResponse_JsonResult);
        Contracts.throwIfNullOrUndefined(json, "json");
        return new PronunciationAssessmentResult(json);
    }
    /**
     * Gets the detail result of pronunciation assessment.
     * @member PronunciationAssessmentConfig.prototype.detailResult
     * @function
     * @public
     * @returns {DetailResult} detail result.
     */
    get detailResult() {
        return this.privPronJson;
    }
    /**
     * The score indicating the pronunciation accuracy of the given speech, which indicates
     * how closely the phonemes match a native speaker's pronunciation.
     * @member PronunciationAssessmentResult.prototype.accuracyScore
     * @function
     * @public
     * @returns {number} Accuracy score.
     */
    get accuracyScore() {
        var _a;
        return (_a = this.detailResult.PronunciationAssessment) === null || _a === void 0 ? void 0 : _a.AccuracyScore;
    }
    /**
     * The overall score indicating the pronunciation quality of the given speech.
     * This is calculated from AccuracyScore, FluencyScore and CompletenessScore with weight.
     * @member PronunciationAssessmentResult.prototype.pronunciationScore
     * @function
     * @public
     * @returns {number} Pronunciation score.
     */
    get pronunciationScore() {
        var _a;
        return (_a = this.detailResult.PronunciationAssessment) === null || _a === void 0 ? void 0 : _a.PronScore;
    }
    /**
     * The score indicating the completeness of the given speech by calculating the ratio of pronounced words towards entire input.
     * @member PronunciationAssessmentResult.prototype.completenessScore
     * @function
     * @public
     * @returns {number} Completeness score.
     */
    get completenessScore() {
        var _a;
        return (_a = this.detailResult.PronunciationAssessment) === null || _a === void 0 ? void 0 : _a.CompletenessScore;
    }
    /**
     * The score indicating the fluency of the given speech.
     * @member PronunciationAssessmentResult.prototype.fluencyScore
     * @function
     * @public
     * @returns {number} Fluency score.
     */
    get fluencyScore() {
        var _a;
        return (_a = this.detailResult.PronunciationAssessment) === null || _a === void 0 ? void 0 : _a.FluencyScore;
    }
    /**
     * The prosody score, which indicates how nature of the given speech, including stress, intonation, speaking speed and rhythm.
     * @member PronunciationAssessmentResult.prototype.prosodyScore
     * @function
     * @public
     * @returns {number} Prosody score.
     */
    get prosodyScore() {
        var _a;
        return (_a = this.detailResult.PronunciationAssessment) === null || _a === void 0 ? void 0 : _a.ProsodyScore;
    }
    /**
     * The concent assessment result.
     * Only available when content assessment is enabled.
     * @member PronunciationAssessmentResult.prototype.contentAssessmentResult
     * @function
     * @public
     * @returns {ContentAssessmentResult} Content assessment result.
     */
    get contentAssessmentResult() {
        if (this.detailResult.ContentAssessment === undefined) {
            return undefined;
        }
        return new ContentAssessmentResult(this.detailResult);
    }
}

//# sourceMappingURL=PronunciationAssessmentResult.js.map
