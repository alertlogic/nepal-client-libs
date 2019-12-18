/**
 * Herald API client v2
 */
import { AlApiClient, AlDefaultClient } from '@al/client';
import { AlHeraldClientInstance } from './al-herald-client';

export class AlHeraldClientInstanceV2 extends AlHeraldClientInstance {

    protected serviceVersion = 'v2';

    super(client:AlApiClient = null ) {
        this.client = client || AlDefaultClient;
    }

}
