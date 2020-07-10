/**
 * Module to deal with available Sources Public API endpoints
 */
import {
    AlApiClient,
    AlDefaultClient,
} from '@al/core';
import {
    EnvironmentCredential,
    EnvironmentSource
} from './types';

export class AlSourcesClientInstance {

    private serviceName = 'sources';
    /* istanbul ignore next */
    constructor(public client: AlApiClient = AlDefaultClient) {
    }

    async getSources(accountId: string, filters?: string) {
        const sources = await this.client.fetch({
            service_name: this.serviceName,
            account_id: accountId,
            path: '/sources',
            params: filters,
            version: 1
        });
        return sources as EnvironmentSource[];
    }

    async getSource(accountId: string, sourceId: string) {
        const source = await this.client.fetch({
            service_name: this.serviceName,
            account_id: accountId,
            path: `/sources/${sourceId}`,
            version: 1
        });
        return source as EnvironmentSource;
    }

    async createSource(accountId: string, source: EnvironmentSource) {
        const create = await this.client.post({
            service_name: this.serviceName,
            account_id: accountId,
            path: '/sources',
            data: source,
            version: 1
        });
        return create as EnvironmentSource;
    }

    async replaceSource(accountId: string, sourceId: string, source: EnvironmentSource) {
        const replacedSource = await this.client.put({
            service_name: this.serviceName,
            account_id: accountId,
            path: `/sources/${sourceId}`,
            data: source,
            version: 1
        });
        return replacedSource as EnvironmentSource;
    }

    async deleteSource(accountId: string, sourceId: string) {
        const deleteSource = await this.client.delete({
            service_name: this.serviceName,
            account_id: accountId,
            path: `/sources/${sourceId}`,
            version: 1
        });
        return deleteSource;
    }

    async deleteAllSources(accountId: string, filters?: string) {
        const deleteSources = await this.client.delete({
            service_name: this.serviceName,
            account_id: accountId,
            path: '/sources',
            params: filters,
            version: 1
        });
        return deleteSources;
    }

    async getCredentials(accountId: string, filters?: string) {
        const sources = await this.client.fetch({
            service_name: this.serviceName,
            account_id: accountId,
            path: '/credentials',
            params: filters,
            version: 1
        });
        return sources as EnvironmentCredential[];
    }

    async getCredential(accountId: string, credentialId: string) {
        const source = await this.client.fetch({
            service_name: this.serviceName,
            account_id: accountId,
            path: `/credentials/${credentialId}`,
            version: 1
        });
        return source as EnvironmentCredential;
    }

    async createCredential(accountId: string, credential: EnvironmentCredential) {
        const create = await this.client.post({
            service_name: this.serviceName,
            account_id: accountId,
            path: '/credentials',
            data: credential,
            version: 1
        });
        return create as EnvironmentCredential;
    }

    async replaceCredential(accountId: string, sourceId: string, credential: EnvironmentCredential) {
        const replacedCredential = await this.client.set({
            service_name: this.serviceName,
            account_id: accountId,
            path: `/credentials/${sourceId}`,
            data: credential,
            version: 1
        });
        return replacedCredential as EnvironmentCredential;
    }

    async deleteCredential(accountId: string, credentialId: string, filters?: string) {
        const deleteCredential = await this.client.delete({
            service_name: this.serviceName,
            account_id: accountId,
            path: `/credentials/${credentialId}`,
            params: filters,
            version: 1
        });
        return deleteCredential;
    }
}
