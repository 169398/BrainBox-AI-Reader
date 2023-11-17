// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import { Contracts } from "../../sdk/Contracts.js";
import { TranslationStatus } from "../TranslationStatus.js";
export class TranslationHypothesis {
    constructor(hypothesis) {
        this.privTranslationHypothesis = hypothesis;
        this.privTranslationHypothesis.Translation.TranslationStatus = TranslationStatus[this.privTranslationHypothesis.Translation.TranslationStatus];
    }
    static fromJSON(json) {
        return new TranslationHypothesis(JSON.parse(json));
    }
    static fromTranslationResponse(translationHypothesis) {
        Contracts.throwIfNullOrUndefined(translationHypothesis, "translationHypothesis");
        const hypothesis = translationHypothesis.SpeechHypothesis;
        translationHypothesis.SpeechHypothesis = undefined;
        hypothesis.Translation = translationHypothesis;
        return new TranslationHypothesis(hypothesis);
    }
    get Duration() {
        return this.privTranslationHypothesis.Duration;
    }
    get Offset() {
        return this.privTranslationHypothesis.Offset;
    }
    get Text() {
        return this.privTranslationHypothesis.Text;
    }
    get Translation() {
        return this.privTranslationHypothesis.Translation;
    }
    get Language() {
        var _a;
        return (_a = this.privTranslationHypothesis.PrimaryLanguage) === null || _a === void 0 ? void 0 : _a.Language;
    }
}

//# sourceMappingURL=TranslationHypothesis.js.map
