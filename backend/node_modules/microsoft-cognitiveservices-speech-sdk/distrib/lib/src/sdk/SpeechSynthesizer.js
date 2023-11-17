// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { SpeechSynthesisConnectionFactory, SpeechSynthesisAdapter, SynthesisRestAdapter, } from "../common.speech/Exports.js";
import { createNoDashGuid, marshalPromiseToCallbacks, } from "../common/Exports.js";
import { AudioFileWriter } from "./Audio/AudioFileWriter.js";
import { AudioOutputFormatImpl } from "./Audio/AudioOutputFormat.js";
import { PushAudioOutputStreamImpl } from "./Audio/AudioOutputStream.js";
import { Contracts } from "./Contracts.js";
import { AudioConfig, PropertyId, PullAudioOutputStream, PushAudioOutputStreamCallback, SpeechSynthesisOutputFormat, SynthesisVoicesResult, Synthesizer } from "./Exports.js";
import { SynthesisRequest } from "./Synthesizer.js";
/**
 * Defines the class SpeechSynthesizer for text to speech.
 * Updated in version 1.16.0
 * @class SpeechSynthesizer
 */
export class SpeechSynthesizer extends Synthesizer {
    /**
     * SpeechSynthesizer constructor.
     * @constructor
     * @param {SpeechConfig} speechConfig - An set of initial properties for this synthesizer.
     * @param {AudioConfig} audioConfig - An optional audio configuration associated with the synthesizer.
     */
    constructor(speechConfig, audioConfig) {
        super(speechConfig);
        if (audioConfig !== null) {
            if (audioConfig === undefined) {
                this.audioConfig = (typeof window === "undefined") ? undefined : AudioConfig.fromDefaultSpeakerOutput();
            }
            else {
                this.audioConfig = audioConfig;
            }
        }
        this.privConnectionFactory = new SpeechSynthesisConnectionFactory();
        this.implCommonSynthesizeSetup();
    }
    /**
     * SpeechSynthesizer constructor.
     * @constructor
     * @param {SpeechConfig} speechConfig - an set of initial properties for this synthesizer
     * @param {AutoDetectSourceLanguageConfig} autoDetectSourceLanguageConfig - An source language detection configuration associated with the synthesizer
     * @param {AudioConfig} audioConfig - An optional audio configuration associated with the synthesizer
     */
    static FromConfig(speechConfig, autoDetectSourceLanguageConfig, audioConfig) {
        const speechConfigImpl = speechConfig;
        autoDetectSourceLanguageConfig.properties.mergeTo(speechConfigImpl.properties);
        return new SpeechSynthesizer(speechConfig, audioConfig);
    }
    /**
     * Executes speech synthesis on plain text.
     * The task returns the synthesis result.
     * @member SpeechSynthesizer.prototype.speakTextAsync
     * @function
     * @public
     * @param text - Text to be synthesized.
     * @param cb - Callback that received the SpeechSynthesisResult.
     * @param err - Callback invoked in case of an error.
     * @param stream - AudioOutputStream to receive the synthesized audio.
     */
    speakTextAsync(text, cb, err, stream) {
        this.speakImpl(text, false, cb, err, stream);
    }
    /**
     * Executes speech synthesis on SSML.
     * The task returns the synthesis result.
     * @member SpeechSynthesizer.prototype.speakSsmlAsync
     * @function
     * @public
     * @param ssml - SSML to be synthesized.
     * @param cb - Callback that received the SpeechSynthesisResult.
     * @param err - Callback invoked in case of an error.
     * @param stream - AudioOutputStream to receive the synthesized audio.
     */
    speakSsmlAsync(ssml, cb, err, stream) {
        this.speakImpl(ssml, true, cb, err, stream);
    }
    /**
     * Get list of synthesis voices available.
     * The task returns the synthesis voice result.
     * @member SpeechSynthesizer.prototype.getVoicesAsync
     * @function
     * @async
     * @public
     * @param locale - Locale of voices in BCP-47 format; if left empty, get all available voices.
     * @return {Promise<SynthesisVoicesResult>} - Promise of a SynthesisVoicesResult.
     */
    getVoicesAsync(locale = "") {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getVoices(locale);
        });
    }
    /**
     * Dispose of associated resources.
     * @member SpeechSynthesizer.prototype.close
     * @function
     * @public
     */
    close(cb, err) {
        Contracts.throwIfDisposed(this.privDisposed);
        marshalPromiseToCallbacks(this.dispose(true), cb, err);
    }
    /**
     * @Internal
     * Do not use externally, object returned will change without warning or notice.
     */
    get internalData() {
        return this.privAdapter;
    }
    //
    // ################################################################################################################
    // IMPLEMENTATION.
    // ################################################################################################################
    //
    // Creates the synthesis adapter
    createSynthesisAdapter(authentication, connectionFactory, synthesizerConfig) {
        return new SpeechSynthesisAdapter(authentication, connectionFactory, synthesizerConfig, this, this.audioConfig);
    }
    createRestSynthesisAdapter(authentication, synthesizerConfig) {
        return new SynthesisRestAdapter(synthesizerConfig, authentication);
    }
    implCommonSynthesizeSetup() {
        super.implCommonSynthesizeSetup();
        this.privAdapter.audioOutputFormat = AudioOutputFormatImpl.fromSpeechSynthesisOutputFormat(SpeechSynthesisOutputFormat[this.properties.getProperty(PropertyId.SpeechServiceConnection_SynthOutputFormat, undefined)]);
    }
    speakImpl(text, IsSsml, cb, err, dataStream) {
        try {
            Contracts.throwIfDisposed(this.privDisposed);
            const requestId = createNoDashGuid();
            let audioDestination;
            if (dataStream instanceof PushAudioOutputStreamCallback) {
                audioDestination = new PushAudioOutputStreamImpl(dataStream);
            }
            else if (dataStream instanceof PullAudioOutputStream) {
                audioDestination = dataStream;
            }
            else if (dataStream !== undefined) {
                audioDestination = new AudioFileWriter(dataStream);
            }
            else {
                audioDestination = undefined;
            }
            this.synthesisRequestQueue.enqueue(new SynthesisRequest(requestId, text, IsSsml, (e) => {
                this.privSynthesizing = false;
                if (!!cb) {
                    try {
                        cb(e);
                    }
                    catch (e) {
                        if (!!err) {
                            err(e);
                        }
                    }
                }
                cb = undefined;
                /* eslint-disable no-empty */
                this.adapterSpeak().catch(() => { });
            }, (e) => {
                if (!!err) {
                    err(e);
                }
            }, audioDestination));
            /* eslint-disable no-empty-function */
            this.adapterSpeak().catch(() => { });
        }
        catch (error) {
            if (!!err) {
                if (error instanceof Error) {
                    const typedError = error;
                    err(typedError.name + ": " + typedError.message);
                }
                else {
                    err(error);
                }
            }
            // Destroy the synthesizer.
            /* eslint-disable no-empty */
            this.dispose(true).catch(() => { });
        }
    }
    getVoices(locale) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestId = createNoDashGuid();
            const response = yield this.privRestAdapter.getVoicesList(requestId);
            if (response.ok && Array.isArray(response.json)) {
                let json = response.json;
                if (!!locale && locale.length > 0) {
                    json = json.filter((item) => !!item.Locale && item.Locale.toLowerCase() === locale.toLowerCase());
                }
                return new SynthesisVoicesResult(requestId, json, undefined);
            }
            else {
                return new SynthesisVoicesResult(requestId, undefined, `Error: ${response.status}: ${response.statusText}`);
            }
        });
    }
}

//# sourceMappingURL=SpeechSynthesizer.js.map
