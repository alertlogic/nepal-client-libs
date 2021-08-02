/**
 * Module to deal with available Ticket Master Public API endpoints
 */
import { ALClient } from '@al/core';

export interface ImageRecord {
  [key: string]: string;
}

export interface AlbumImagesResponse {
  type?: string;
  product?: string;
  images?: ImageRecord[];
}

export interface ShareRecord {
  [key: string]: string;
}

export interface AlbumSharesResponse {
  type?: string;
  product?: string;
  shares?: ShareRecord[];
}

class AlbumClient {

  private client = ALClient;
  private serviceName = 'album';

  /**
   * Get current image list
   * GET
   * /album/v1/images?type=:type&product=:product
   * "https://api.cloudinsight.alertlogic.com/album/v1/images?type=aws"
   */
  async getImages(queryParams?: {type?: string, product?: string}): Promise<AlbumImagesResponse> {
    return this.client.get<AlbumImagesResponse>({
      service_name: this.serviceName,
      path: '/images',
      params: queryParams,
    });

  }

  /**
   * Get shares
   * GET
   * /album/v1/images/:image_id/shares
   * "https://api.cloudinsight.alertlogic.com/album/v1/images/ami-1234567/shares?type=aws"
   */
  async getShares(amiId: string, queryParams?: {type?: string, type_id?: string}): Promise<AlbumSharesResponse> {
    return this.client.get<AlbumSharesResponse>({
      service_name: this.serviceName,
      path: `/images/${amiId}/shares`,
      params: queryParams,
    });

  }

  /**
   * Share images
   * PUT
   * /album/v1/shares/:type/:type_id
   * "https://api.cloudinsight.alertlogic.com/album/v1/shares/aws/123456789012"
   */
  async shareImage(type: string, typeId: string): Promise<any> {
    return this.client.put<any>({
      service_name: this.serviceName,
      path: `/shares/${type}/${typeId}`,
    });
  }

  /**
   * Unshare images
   * DELETE
   * /album/v1/shares/:type/:type_id
   * "https://api.cloudinsight.alertlogic.com/album/v1/shares/aws/123456789012"
   */
  async unshareImage(type: string, typeId: string): Promise<any> {
    return this.client.delete<any>({
      service_name: this.serviceName,
      path: `/shares/${type}/${typeId}`,
    });
  }

}

export const albumClient = new AlbumClient();
