export interface AlAssetsManagerSubnet {
    key?: string;
    subnet_name?: string;
    cidr_block?: string;
    network?: string;
}

export function newSubnet(): AlAssetsManagerSubnet {
    return {
        key: '',
        subnet_name: '',
        cidr_block: '',
        network: '',
    };
}
