import { PhoenixTopologySnapshot, TopologyNode } from "./types";


    /**
* Performs the search of assets matching a string against fields: key, name and description.
*
* This function traverses the topology set to find assets matching a search phrase,
* optionally limiting to visible elements, and applies a callback to *each* corresponding graph node.
* @param {PhoenixTopologySnapshot} topology The topology data
* @param {string} selectedRegionKey the asset key of a region item in topology (set as undefined it there is not one)
* @param {string} searchPhrase text to do to pattern matching with.
* @param {boolean} includeInvisibleItems is a flag to tell whether include un-scoped and filtered assets or not
* @param {Array<string>} extraProperties additional properities to to trye to match. Default are the IP address-related ones.
* @returns { { [key: string]: TopologyNode }} the  assets found.
*/
export function search(
                        topology: PhoenixTopologySnapshot,
                        selectedRegionKey: string,
                        searchPhrase: string,
                        includeInvisibleItems: boolean,
                        extraProperties: string[] =
                            [   'public_ip',
                                'ip_address',
                                'private_ip_address',
                                'local_ipv6',
                                'local_ipv4',
                                'public_ipv6_addresses',
                                'public_ipv4_addresses',
                                'public_ip_addresses',
                                'private_ip_addresses',
                                'private_ipv6_addresses',
                                'private_ipv4_addresses']
                    ): { [key: string]: TopologyNode } {
    const hits: { [key: string]: TopologyNode } = {};

    /**
    * Performs the search on asset fields
    * @returns {boolean} true for matched, false otherwise.
    */
    const match = (asset: TopologyNode): boolean => {
        const searchMatch = new RegExp(searchPhrase
            .replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,
                '\\$&'), 'i');
        let matched = false;

        if (!includeInvisibleItems) {
            if (asset['exclude']) {
                return false;
            }
        }

        /* More fields could be included in search here */
        matched = searchMatch.test(asset.key);
        matched = matched || (asset.name && searchMatch.test(asset.name));
        matched = matched || (asset.properties['description'] && searchMatch.test(asset.properties['description']));
        matched = matched || (asset.properties['cidr_block'] && searchMatch.test(asset.properties['cidr_block']));
        if (asset.type === 'host') {
            const ips: string = extraProperties.reduce((acc: string, prop: string) => {
                let addresses: string[] | string = (asset.properties[prop] ?? []);
                if (typeof (addresses) === 'string') {
                    addresses = [addresses];
                }
                return acc + ',' + addresses.join();

            }, '');
            matched = matched || searchMatch.test(ips);
        }

        if (matched) {
            asset.matched = true;
            hits[asset.key] = asset;
        } else {
            asset.matched = false;
        }
        return matched;
    };

    if (selectedRegionKey) {
        topology.getByKey(selectedRegionKey).iterate((node: TopologyNode) => {
            match(node);
            return true;
        });
    } else {
        topology.iterate((node: TopologyNode) => {
            match(node);
            return true;
        });
    }
    return hits;
}
