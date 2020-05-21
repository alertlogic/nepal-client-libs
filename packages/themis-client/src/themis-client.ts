/**
 * Module to deal with available Themis Public API endpoints
 */
import {
  AlApiClient,
  AlDefaultClient,
} from '@al/core';

export interface ThemisRoleDocument {
  type?: 'ci_full' | 'cd_full' | 'ci_x_account_ct' | 'ci_readonly' | 'ci_essentials';
  platform_type?: 'aws' | 'azure';
  policy_document?: any;
  external_id?: string;
  aws_account_id?: string;
  version?: string;
  cft?: {
      s3_bucket?: string;
      s3_key?: string;
      s3_url?: string;
  };
}

export interface AWSRole {
  platform_type: 'aws';
  role_type: 'ci_full' | 'cd_full' | 'ci_x_account_ct' | 'ci_readonly' | 'ci_essentials';
  role_version?: string;
  arn?: string;
  external_id?: string;
}

export interface AWSRoleValidationResponse {
  status?: string;
  message?: string;
  version?: string;
}

class ThemisClient {

  private serviceName = 'themis';

  constructor(
      public client:AlApiClient = AlDefaultClient
  ) {}

  async getRole(
      accountId: string,
      roleType: 'ci_full' | 'cd_full' | 'ci_x_account_ct' | 'ci_readonly' | 'ci_essentials',
      platformType: 'aws' | 'azure'
  ) {
      const role = await this.client.fetch({
          service_name: this.serviceName,
          account_id: accountId,
          path: `/roles/${platformType}/${roleType}/latest`,
      });
      return role as ThemisRoleDocument;
  }

  async getRoles(accountId: string) {
      const roles = await this.client.fetch({
          service_name: this.serviceName,
          account_id: accountId,
          path: '/roles',
      });
      return roles as { roles: ThemisRoleDocument[] };
  }

  async validateRoleCredentials(accountId: string, awsRole: AWSRole) {
      const validate = await this.client.post({
          service_name: this.serviceName,
          account_id: accountId,
          path: `/validate/${awsRole.platform_type}/${awsRole.role_type}`,
      });
      return validate as AWSRoleValidationResponse;
  }
}

export const themisClient = new ThemisClient();
