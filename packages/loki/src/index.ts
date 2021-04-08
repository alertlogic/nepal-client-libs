import { AlGlobalizer } from "@al/core";
import { AlLokiClientInstance } from "./loki-client";

export * from './loki-client';
export * from './loki-client.type';

export const AlLokiClient = AlGlobalizer.instantiate( "al.loki", () => new AlLokiClientInstance() );

