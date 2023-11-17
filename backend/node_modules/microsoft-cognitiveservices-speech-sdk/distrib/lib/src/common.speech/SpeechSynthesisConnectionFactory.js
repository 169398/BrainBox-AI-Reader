// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import { ProxyInfo, WebsocketConnection } from "../common.browser/Exports.js";
import { PropertyId } from "../sdk/Exports.js";
import { ConnectionFactoryBase } from "./ConnectionFactoryBase.js";
import { WebsocketMessageFormatter } from "./Exports.js";
import { HeaderNames } from "./HeaderNames.js";
import { QueryParameterNames } from "./QueryParameterNames.js";
export class SpeechSynthesisConnectionFactory {
    constructor() {
        this.synthesisUri = "/cognitiveservices/websocket/v1";
    }
    create(config, authInfo, connectionId) {
        let endpoint = config.parameters.getProperty(PropertyId.SpeechServiceConnection_Endpoint, undefined);
        const region = config.parameters.getProperty(PropertyId.SpeechServiceConnection_Region, undefined);
        const hostSuffix = ConnectionFactoryBase.getHostSuffix(region);
        const endpointId = config.parameters.getProperty(PropertyId.SpeechServiceConnection_EndpointId, undefined);
        const hostPrefix = (endpointId === undefined) ? "tts" : "voice";
        const host = config.parameters.getProperty(PropertyId.SpeechServiceConnection_Host, "wss://" + region + "." + hostPrefix + ".speech" + hostSuffix);
        const queryParams = {};
        const headers = {};
        if (authInfo.token !== undefined && authInfo.token !== "") {
            headers[authInfo.headerName] = authInfo.token;
        }
        headers[HeaderNames.ConnectionId] = connectionId;
        if (endpointId !== undefined && endpointId !== "") {
            if (!endpoint || endpoint.search(QueryParameterNames.CustomVoiceDeploymentId) === -1) {
                queryParams[QueryParameterNames.CustomVoiceDeploymentId] = endpointId;
            }
        }
        if (config.avatarEnabled) {
            if (!endpoint || endpoint.search(QueryParameterNames.EnableAvatar) === -1) {
                queryParams[QueryParameterNames.EnableAvatar] = "true";
            }
        }
        if (!endpoint) {
            endpoint = host + this.synthesisUri;
        }
        config.parameters.setProperty(PropertyId.SpeechServiceConnection_Url, endpoint);
        const enableCompression = config.parameters.getProperty("SPEECH-EnableWebsocketCompression", "false") === "true";
        return new WebsocketConnection(endpoint, queryParams, headers, new WebsocketMessageFormatter(), ProxyInfo.fromParameters(config.parameters), enableCompression, connectionId);
    }
}

//# sourceMappingURL=SpeechSynthesisConnectionFactory.js.map
