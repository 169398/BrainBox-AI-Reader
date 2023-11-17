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
import { SpeechSynthesisConnectionFactory } from "../common.speech/SpeechSynthesisConnectionFactory.js";
import { AvatarSynthesisAdapter } from "../common.speech/Exports.js";
import { createNoDashGuid, Deferred, Events, EventType, PlatformEvent } from "../common/Exports.js";
import { AudioOutputFormatImpl } from "./Audio/AudioOutputFormat.js";
import { PropertyId, SpeechSynthesisOutputFormat, SynthesisResult, Synthesizer } from "./Exports.js";
import { Contracts } from "./Contracts.js";
import { SynthesisRequest } from "./Synthesizer.js";
/**
 * Defines the avatar synthesizer.
 * @class AvatarSynthesizer
 * Added in version 1.33.0
 *
 * @experimental This feature is experimental and might change or have limited support.
 */
export class AvatarSynthesizer extends Synthesizer {
    /**
     * Creates and initializes an instance of this class.
     * @constructor
     * @param {SpeechConfig} speechConfig - The speech config.
     * @param {AvatarConfig} avatarConfig - The talking avatar config.
     */
    constructor(speechConfig, avatarConfig) {
        super(speechConfig);
        Contracts.throwIfNullOrUndefined(avatarConfig, "avatarConfig");
        this.privConnectionFactory = new SpeechSynthesisConnectionFactory();
        this.privAvatarConfig = avatarConfig;
        this.implCommonSynthesizeSetup();
    }
    implCommonSynthesizeSetup() {
        super.implCommonSynthesizeSetup();
        // The service checks the audio format setting while it ignores it in avatar synthesis.
        this.privAdapter.audioOutputFormat = AudioOutputFormatImpl.fromSpeechSynthesisOutputFormat(SpeechSynthesisOutputFormat.Riff24Khz16BitMonoPcm);
    }
    /**
     * Starts the talking avatar session and establishes the WebRTC connection.
     * @member AvatarSynthesizer.prototype.startAvatarAsync
     * @function
     * @public
     * @param {AvatarWebRTCConnectionInfo} peerConnection - The peer connection.
     * @returns {Promise<SynthesisResult>} The promise of the connection result.
     */
    startAvatarAsync(peerConnection) {
        return __awaiter(this, void 0, void 0, function* () {
            Contracts.throwIfNullOrUndefined(peerConnection, "peerConnection");
            this.privIceServers = peerConnection.getConfiguration().iceServers;
            Contracts.throwIfNullOrUndefined(this.privIceServers, "Ice servers must be set.");
            const iceGatheringDone = new Deferred();
            // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/icegatheringstatechange_event
            peerConnection.onicegatheringstatechange = () => {
                Events.instance.onEvent(new PlatformEvent("peer connection: ice gathering state: " + peerConnection.iceGatheringState, EventType.Debug));
                if (peerConnection.iceGatheringState === "complete") {
                    Events.instance.onEvent(new PlatformEvent("peer connection: ice gathering complete.", EventType.Info));
                    iceGatheringDone.resolve();
                }
            };
            const sdp = yield peerConnection.createOffer();
            yield peerConnection.setLocalDescription(sdp);
            yield iceGatheringDone.promise;
            Events.instance.onEvent(new PlatformEvent("peer connection: got local SDP.", EventType.Info));
            this.privProperties.setProperty(PropertyId.TalkingAvatarService_WebRTC_SDP, JSON.stringify(peerConnection.localDescription));
            const result = yield this.speak("", false);
            const sdpAnswerString = atob(result.properties.getProperty(PropertyId.TalkingAvatarService_WebRTC_SDP));
            const sdpAnswer = new RTCSessionDescription(JSON.parse(sdpAnswerString));
            yield peerConnection.setRemoteDescription(sdpAnswer);
            return new SynthesisResult(result.resultId, result.reason, undefined, result.properties);
        });
    }
    /**
     * Speaks plain text asynchronously. The rendered audio and video will be sent via the WebRTC connection.
     * @member AvatarSynthesizer.prototype.speakTextAsync
     * @function
     * @public
     * @param {string} text - The plain text to speak.
     * @returns {Promise<SynthesisResult>} The promise of the synthesis result.
     */
    speakTextAsync(text) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.speak(text, false);
            return new SynthesisResult(r.resultId, r.reason, r.errorDetails, r.properties);
        });
    }
    /**
     * Speaks SSML asynchronously. The rendered audio and video will be sent via the WebRTC connection.
     * @member AvatarSynthesizer.prototype.speakSsmlAsync
     * @function
     * @public
     * @param {string} ssml - The SSML text to speak.
     * @returns {Promise<SynthesisResult>} The promise of the synthesis result.
     */
    speakSsmlAsync(ssml) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = yield this.speak(ssml, true);
            return new SynthesisResult(r.resultId, r.reason, r.errorDetails, r.properties);
        });
    }
    /**
     * Speaks text asynchronously. The avatar will switch to idle state.
     * @member AvatarSynthesizer.prototype.stopSpeakingAsync
     * @function
     * @public
     * @returns {Promise<void>} The promise of the void result.
     */
    stopSpeakingAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.privAdapter.stopSpeaking();
        });
    }
    /**
     * Stops the talking avatar session and closes the WebRTC connection.
     * For now, this is the same as close().
     * You need to create a new AvatarSynthesizer instance to start a new session.
     * @member AvatarSynthesizer.prototype.stopAvatarAsync
     * @function
     * @public
     * @returns {Promise<void>} The promise of the void result.
     */
    stopAvatarAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            Contracts.throwIfDisposed(this.privDisposed);
            return this.dispose(true);
        });
    }
    /**
     * Dispose of associated resources.
     * @member AvatarSynthesizer.prototype.close
     * @function
     * @public
     */
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.privDisposed) {
                return;
            }
            return this.dispose(true);
        });
    }
    /**
     * Gets the ICE servers. Internal use only.
     */
    get iceServers() {
        return this.privIceServers;
    }
    // Creates the synthesis adapter
    createSynthesisAdapter(authentication, connectionFactory, synthesizerConfig) {
        return new AvatarSynthesisAdapter(authentication, connectionFactory, synthesizerConfig, this, this.privAvatarConfig);
    }
    createRestSynthesisAdapter(_authentication, _synthesizerConfig) {
        return undefined;
    }
    createSynthesizerConfig(speechConfig) {
        const config = super.createSynthesizerConfig(speechConfig);
        config.avatarEnabled = true;
        return config;
    }
    speak(text, isSSML) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestId = createNoDashGuid();
            const deferredResult = new Deferred();
            this.synthesisRequestQueue.enqueue(new SynthesisRequest(requestId, text, isSSML, (e) => {
                deferredResult.resolve(e);
                this.privSynthesizing = false;
                void this.adapterSpeak();
            }, (e) => {
                deferredResult.reject(e);
                this.privSynthesizing = false;
            }));
            void this.adapterSpeak();
            return deferredResult.promise;
        });
    }
}

//# sourceMappingURL=AvatarSynthesizer.js.map
