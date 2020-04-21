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

  private alClient = ALClient;
  private serviceName = 'album';

  /**
   * Get current image list
   * GET
   * /album/v1/images?type=:type&product=:product
   * "https://api.cloudinsight.alertlogic.com/album/v1/images?type=aws"
   */
  async getImages(queryParams?: {type?: string, product?: string}) {
    const images = await this.alClient.fetch({
      service_name: this.serviceName,
      path: '/images',
      params: queryParams,
    });
    return images as AlbumImagesResponse;
  }

  /**
   * Get shares
   * GET
   * /album/v1/images/:image_id/shares
   * "https://api.cloudinsight.alertlogic.com/album/v1/images/ami-1234567/shares?type=aws"
   */
  async getShares(amiId: string, queryParams?: {type?: string, type_id?: string}) {
    const images = await this.alClient.fetch({
      service_name: this.serviceName,
      path: `/images/${amiId}/shares`,
      params: queryParams,
    });
    return images as AlbumSharesResponse;
  }

  /**
   * Share images
   * PUT
   * /album/v1/shares/:type/:type_id
   * "https://api.cloudinsight.alertlogic.com/album/v1/shares/aws/123456789012"
   */
  async shareImage(type: string, typeId: string) {
    const share = await this.alClient.set({
      service_name: this.serviceName,
      path: `/shares/${type}/${typeId}`,
    });
    return share;
  }

  /**
   * Unshare images
   * DELETE
   * /album/v1/shares/:type/:type_id
   * "https://api.cloudinsight.alertlogic.com/album/v1/shares/aws/123456789012"
   */
  async unshareImage(type: string, typeId: string) {
    const share = await this.alClient.delete({
      service_name: this.serviceName,
      path: `/shares/${type}/${typeId}`,
    });
    return share;
  }

}

export const albumClient = new AlbumClient();
