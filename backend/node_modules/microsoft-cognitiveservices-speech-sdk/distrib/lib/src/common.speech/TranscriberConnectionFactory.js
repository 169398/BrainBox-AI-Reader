// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import { ProxyInfo, WebsocketConnection, } from "../common.browser/Exports.js";
import { OutputFormat, PropertyId } from "../sdk/Exports.js";
import { ConnectionFactoryBase } from "./ConnectionFactoryBase.js";
import { OutputFormatPropertyName, WebsocketMessageFormatter } from "./Exports.js";
import { HeaderNames } from "./HeaderNames.js";
import { QueryParameterNames } from "./QueryParameterNames.js";
export class TranscriberConnectionFactory extends ConnectionFactoryBase {
    constructor() {
        super(...arguments);
        this.multiaudioRelativeUri = "/speech/recognition/multiaudio";
    }
    create(config, authInfo, connectionId) {
        let endpoint = config.parameters.getProperty(PropertyId.SpeechServiceConnection_Endpoint, undefined);
        const region = config.parameters.getProperty(PropertyId.SpeechServiceConnection_Region, "centralus");
        const hostSuffix = ConnectionFactoryBase.getHostSuffix(region);
        const hostDefault = "wss://transcribe." + region + ".cts.speech" + hostSuffix + this.multiaudioRelativeUri;
        const host = config.parameters.getProperty(PropertyId.SpeechServiceConnection_Host, hostDefault);
        const queryParams = {};
        this.setQueryParams(queryParams, config, endpoint);
        if (!endpoint) {
            endpoint = host;
        }
        const headers = {};
        if (authInfo.token !== undefined && authInfo.token !== "") {
            headers[authInfo.headerName] = authInfo.token;
        }
        headers[HeaderNames.ConnectionId] = connectionId;
        config.parameters.setProperty(PropertyId.SpeechServiceConnection_Url, endpoint);
        const enableCompression = config.parameters.getProperty("SPEECH-EnableWebsocketCompression", "false") === "true";
        return new WebsocketConnection(endpoint, queryParams, headers, new WebsocketMessageFormatter(), ProxyInfo.fromRecognizerConfig(config), enableCompression, connectionId);
    }
    setQueryParams(queryParams, config, endpointUrl) {
        const endpointId = config.parameters.getProperty(PropertyId.SpeechServiceConnection_EndpointId, undefined);
        const language = config.parameters.getProperty(PropertyId.SpeechServiceConnection_RecoLanguage, undefined);
        if (endpointId && !(QueryParameterNames.CustomSpeechDeploymentId in queryParams)) {
            queryParams[QueryParameterNames.CustomSpeechDeploymentId] = endpointId;
        }
        if (language && !(QueryParameterNames.Language in queryParams)) {
            queryParams[QueryParameterNames.Language] = language;
        }
        const wordLevelTimings = config.parameters.getProperty(PropertyId.SpeechServiceResponse_RequestWordLevelTimestamps, "false").toLowerCase() === "true";
        const detailed = config.parameters.getProperty(OutputFormatPropertyName, OutputFormat[OutputFormat.Simple]) !== OutputFormat[OutputFormat.Simple];
        if (wordLevelTimings || detailed) {
            queryParams[QueryParameterNames.Format] = OutputFormat[OutputFormat.Detailed].toLowerCase();
        }
        this.setCommonUrlParams(config, queryParams, endpointUrl);
    }
}

//# sourceMappingURL=TranscriberConnectionFactory.js.map
