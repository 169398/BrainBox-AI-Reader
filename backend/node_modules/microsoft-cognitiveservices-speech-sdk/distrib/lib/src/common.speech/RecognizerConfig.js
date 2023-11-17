// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
/* eslint-disable max-classes-per-file */
import { PropertyId } from "../sdk/Exports.js";
import { Context, SpeechServiceConfig } from "./Exports.js";
export var RecognitionMode;
(function (RecognitionMode) {
    RecognitionMode[RecognitionMode["Interactive"] = 0] = "Interactive";
    RecognitionMode[RecognitionMode["Conversation"] = 1] = "Conversation";
    RecognitionMode[RecognitionMode["Dictation"] = 2] = "Dictation";
})(RecognitionMode || (RecognitionMode = {}));
export var SpeechResultFormat;
(function (SpeechResultFormat) {
    SpeechResultFormat[SpeechResultFormat["Simple"] = 0] = "Simple";
    SpeechResultFormat[SpeechResultFormat["Detailed"] = 1] = "Detailed";
})(SpeechResultFormat || (SpeechResultFormat = {}));
export class RecognizerConfig {
    constructor(speechServiceConfig, parameters) {
        this.privSpeechServiceConfig = speechServiceConfig ? speechServiceConfig : new SpeechServiceConfig(new Context(null));
        this.privParameters = parameters;
        this.privMaxRetryCount = parseInt(parameters.getProperty("SPEECH-Error-MaxRetryCount", "4"), 10);
        this.privLanguageIdMode = parameters.getProperty(PropertyId.SpeechServiceConnection_LanguageIdMode, undefined);
        this.privEnableSpeakerId = false;
    }
    get parameters() {
        return this.privParameters;
    }
    get recognitionMode() {
        return this.privRecognitionMode;
    }
    set recognitionMode(value) {
        this.privRecognitionMode = value;
        this.privRecognitionActivityTimeout = value === RecognitionMode.Interactive ? 8000 : 25000;
        this.privSpeechServiceConfig.Recognition = RecognitionMode[value];
    }
    get SpeechServiceConfig() {
        return this.privSpeechServiceConfig;
    }
    get recognitionActivityTimeout() {
        return this.privRecognitionActivityTimeout;
    }
    get isContinuousRecognition() {
        return this.privRecognitionMode !== RecognitionMode.Interactive;
    }
    get languageIdMode() {
        return this.privLanguageIdMode;
    }
    get autoDetectSourceLanguages() {
        return this.parameters.getProperty(PropertyId.SpeechServiceConnection_AutoDetectSourceLanguages, undefined);
    }
    get recognitionEndpointVersion() {
        return this.parameters.getProperty(PropertyId.SpeechServiceConnection_RecognitionEndpointVersion, undefined);
    }
    get sourceLanguageModels() {
        const models = [];
        let modelsExist = false;
        if (this.autoDetectSourceLanguages !== undefined) {
            for (const language of this.autoDetectSourceLanguages.split(",")) {
                const customProperty = language + PropertyId.SpeechServiceConnection_EndpointId.toString();
                const modelId = this.parameters.getProperty(customProperty, undefined);
                if (modelId !== undefined) {
                    models.push({ language, endpoint: modelId });
                    modelsExist = true;
                }
                else {
                    models.push({ language, endpoint: "" });
                }
            }
        }
        return modelsExist ? models : undefined;
    }
    get maxRetryCount() {
        return this.privMaxRetryCount;
    }
    get isSpeakerDiarizationEnabled() {
        return this.privEnableSpeakerId;
    }
    set isSpeakerDiarizationEnabled(value) {
        this.privEnableSpeakerId = value;
    }
}

//# sourceMappingURL=RecognizerConfig.js.map
