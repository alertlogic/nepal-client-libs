export interface AlAssetManagerNetwork {
    key?: string;
    network_name?: string;
    cidr_ranges?: string[];
    public_cidr_ranges?: string[];
    span_port_enabled?: boolean;
    network_uuid?: string;
}

export function newNetwork(): AlAssetManagerNetwork {
    return {
        key: '',
        network_name: '',
        cidr_ranges: [],
        public_cidr_ranges: [],
        span_port_enabled: false,
        network_uuid: ''
    };
}

export function addPrivateCidr(network:AlAssetManagerNetwork, range: string): AlAssetManagerNetwork {
    network.cidr_ranges.push(range);
    return network;
}

export function addPlublicCidr(network:AlAssetManagerNetwork, range: string): AlAssetManagerNetwork {
    network.public_cidr_ranges.push(range);
    return network;
}

export function removePrivateCidr(network:AlAssetManagerNetwork, range: string): AlAssetManagerNetwork {
    network.cidr_ranges = network.cidr_ranges.filter((privateRange) => privateRange !== range);
    return network;
}

export function removePublicCidr(network:AlAssetManagerNetwork, range: string): AlAssetManagerNetwork {
    network.public_cidr_ranges = network.public_cidr_ranges.filter((publicRange) => publicRange !== range);
    return network;
}

export function privateCidrExists(network:AlAssetManagerNetwork, range: string): boolean {
    return network.cidr_ranges.some(privateRange => privateRange === range );
}

export function publicCidrExists(network:AlAssetManagerNetwork, range: string): boolean {
    return network.public_cidr_ranges.some(publicRange => publicRange === range );
}
