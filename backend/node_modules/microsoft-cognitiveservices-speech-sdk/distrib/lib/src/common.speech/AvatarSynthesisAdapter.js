// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import { AvatarEventArgs, PropertyId, } from "../sdk/Exports.js";
import { SynthesisAdapterBase } from "./Exports.js";
export class AvatarSynthesisAdapter extends SynthesisAdapterBase {
    constructor(authentication, connectionFactory, synthesizerConfig, avatarSynthesizer, avatarConfig) {
        super(authentication, connectionFactory, synthesizerConfig, undefined);
        this.privAvatarSynthesizer = avatarSynthesizer;
        this.privSynthesizer = avatarSynthesizer;
        this.privAvatarConfig = avatarConfig;
    }
    setSynthesisContextSynthesisSection() {
        this.privSynthesisContext.setSynthesisSection(undefined);
    }
    setSpeechConfigSynthesisSection() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        this.privSynthesizerConfig.synthesisVideoSection = {
            format: {
                bitrate: (_a = this.privAvatarConfig.videoFormat) === null || _a === void 0 ? void 0 : _a.bitrate,
                codec: (_b = this.privAvatarConfig.videoFormat) === null || _b === void 0 ? void 0 : _b.codec,
                crop: {
                    bottomRight: {
                        x: (_e = (_d = (_c = this.privAvatarConfig.videoFormat) === null || _c === void 0 ? void 0 : _c.cropRange) === null || _d === void 0 ? void 0 : _d.bottomRight) === null || _e === void 0 ? void 0 : _e.x,
                        y: (_h = (_g = (_f = this.privAvatarConfig.videoFormat) === null || _f === void 0 ? void 0 : _f.cropRange) === null || _g === void 0 ? void 0 : _g.bottomRight) === null || _h === void 0 ? void 0 : _h.y,
                    },
                    topLeft: {
                        x: (_l = (_k = (_j = this.privAvatarConfig.videoFormat) === null || _j === void 0 ? void 0 : _j.cropRange) === null || _k === void 0 ? void 0 : _k.topLeft) === null || _l === void 0 ? void 0 : _l.x,
                        y: (_p = (_o = (_m = this.privAvatarConfig.videoFormat) === null || _m === void 0 ? void 0 : _m.cropRange) === null || _o === void 0 ? void 0 : _o.topLeft) === null || _p === void 0 ? void 0 : _p.y,
                    },
                },
                resolution: {
                    height: (_q = this.privAvatarConfig.videoFormat) === null || _q === void 0 ? void 0 : _q.height,
                    width: (_r = this.privAvatarConfig.videoFormat) === null || _r === void 0 ? void 0 : _r.width,
                },
            },
            protocol: {
                name: "WebRTC",
                webrtcConfig: {
                    clientDescription: btoa(this.privSynthesizerConfig.parameters.getProperty(PropertyId.TalkingAvatarService_WebRTC_SDP)),
                    iceServers: this.privAvatarSynthesizer.iceServers,
                },
            },
            talkingAvatar: {
                background: {
                    color: this.privAvatarConfig.backgroundColor,
                },
                character: this.privAvatarConfig.character,
                customized: this.privAvatarConfig.customized,
                style: this.privAvatarConfig.style,
            }
        };
    }
    onAvatarEvent(metadata) {
        if (!!this.privAvatarSynthesizer.avatarEventReceived) {
            const avatarEventArgs = new AvatarEventArgs(metadata.Data.Offset, metadata.Data.Name);
            try {
                this.privAvatarSynthesizer.avatarEventReceived(this.privAvatarSynthesizer, avatarEventArgs);
            }
            catch (error) {
                // Not going to let errors in the event handler
                // trip things up.
            }
        }
    }
}

//# sourceMappingURL=AvatarSynthesisAdapter.js.map
