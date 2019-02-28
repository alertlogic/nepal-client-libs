/**
 * Module to deal with available Themis Public API endpoints
 */
import { ALClient } from '@al/client';

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
  }
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

  private alClient = ALClient;
  private serviceName = 'themis';

  async getRole(
      accountId: string,
      role_type: 'ci_full' | 'cd_full' | 'ci_x_account_ct' | 'ci_readonly' | 'ci_essentials',
      platform_type: 'aws' | 'azure'
    ) {
    const role = await this.alClient.fetch({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/roles/${platform_type}/${role_type}/latest`,
    });
    return role as ThemisRoleDocument;
  }

  async getRoles(accountId: string) {
    const roles = await this.alClient.fetch({
      service_name: this.serviceName,
      account_id: accountId,
      path: '/roles',
    });
    return roles as {roles: ThemisRoleDocument[]};
  }

  async validateRoleCredentials(accountId: string, awsRole: AWSRole) {
    const validate = await this.alClient.post({
      service_name: this.serviceName,
      account_id: accountId,
      path: `/validate/${awsRole.platform_type}/${awsRole.role_type}`,
    });
    return validate as AWSRoleValidationResponse;
  }
}

export const themisClient =  new ThemisClient();
