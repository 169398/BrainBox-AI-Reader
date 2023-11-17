// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import { SynthesisResult } from "./Exports.js";
/**
 * Defines the avatar WebRTC connection result.
 * @class AvatarWebRTCConnectionResult
 * Added in version 1.33.0
 *
 * @experimental This feature is experimental and might change in the future.
 */
export class AvatarWebRTCConnectionResult extends SynthesisResult {
    /**
     * Creates and initializes an instance of this class.
     * @constructor
     * @param {RTCSessionDescriptionInit} SDPAnswer - The SDP answer of WebRTC connection.
     * @param {string} resultId - The result id.
     * @param {ResultReason} reason - The reason.
     * @param {string} errorDetails - Error details, if provided.
     * @param {PropertyCollection} properties - Additional properties, if provided.
     */
    constructor(SDPAnswer, resultId, reason, errorDetails, properties) {
        super(resultId, reason, errorDetails, properties);
        this.privSDPAnswer = SDPAnswer;
    }
    /**
     * Specifies SDP (Session Description Protocol) answer of WebRTC connection.
     * @member AvatarWebRTCConnectionResult.prototype.SDPAnswer
     * @function
     * @public
     * @returns {RTCSessionDescriptionInit} Specifies the SDP answer of WebRTC connection.
     */
    get SDPAnswer() {
        return this.privSDPAnswer;
    }
}

//# sourceMappingURL=AvatarWebRTCConnectionResult.js.map
