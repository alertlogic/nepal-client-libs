export interface AlWSMAppliance {
    appliance_id: number;
    appliance_name: string;
    customer_id: number;
    customer_name: string;
    zone_id: number;
    uuid: string;
    mte_appliance: number;
    create_date: number;
    features: string[];
}

export interface AlWSMConfigAppliance {
    proxy: {[key:string]: ProxyInfo};
    system: SystemInfo;
}

export interface ProxyInfo {
    settings: {
        bind: unknown[];
        class: {[key:string]: {[key:string]:number|string}};
        error: {
            auth: {deny: number};
            param: {deny: number};
            url: {deny: number};
            r403: number;
            r404: number;
            r502: number;
            sc: number;
            sri: number;
        };
        id: number;
        name: string | null;
        sec: SecInfo;
        ver: number[];
        vhost: {
            as: unknown;
            name: string;
            port: string;
            proto: string;
            port2: unknown;
            proxy_protocol_enabled: number;
        };
        adv: unknown;
        attack_c_l: unknown;
        criticality_a_l: unknown;
        email_a_l: number;
        err_pages: {[key:string]: unknown[]};
        hc: unknown[];
        learn: unknown;
        loadbalance: unknown;
        migrations: number;
        rhost: unknown[];
        sbrl: number;
        syslog_a_l: number;
        v_act: unknown[];
        whitelist: unknown[];
    };
}

export interface SecInfo {
    header: {
        be: number;
        length: number;
        pragma: number;
        strict: number;
        br: [string[]];
        ve: number;
        vp: number;
    };
    key: string;
    mode: number;
    nt: number;
    td: {[key:string]:[]|number};
    ts: number;
    us: {[key:string]:[unknown[]]};
    buri: {
        enabled: number;
        list: unknown[];
    };
    c_enc: number;
    c_enc_iter: number;
    cloak: number;
    cloak_e: number;
    cloak_ee: unknown[];
    cs: unknown[];
    csrf: {
        re: unknown[];
        re_e: number;
    };
    cv: number;
    dpnb: number;
    epe: number;
    fvb: number;
    gparam: {
        enabled: number;
        list: unknown[];
        v: number;
    };
    gparam_sc: {
        enabled: number;
    };
    guri: {
        enabled: number;
        list: unknown[];
        v: number;
    };
    guri_sc: {
        enabled: number;
    };
    ma: number;
    mab: number;
    mode_date: number;
    mpb: number;
    passthru: number;
    pct_u_enc: number;
    pf_pass: number;
    post_max_len: number;
    rae: number;
    regex: string;
    rv: number;
    sbi: number;
    sbi_l: number;
    scv: number;
    sp: unknown;
    static_ext_pc: string;
    static_ext_regex: string;
    static_pass: {
        enabled: number;
    };
    svb: number;
    tce: number;
    tpa: number;
    upload: {
        enabled: number;
        fname: {
            e: number;
            re: string;
        };
        ext_ban: {
            e: number;
            ce: number;
            cext: unknown[];
        };
        filesize: number;
        maxfiles: number;
        maxsize: number;
    };
    vpg: unknown[];
    vs: number;
}

export interface SystemInfo {
    http: {
        global_emerging_threats: number;
    };
    interfaces: {
        eth0: {
            desc: string;
            netmask: string;
            dhcp: 1;
            ipaddr: string;
            media: {
                current: string;
                selected: string;
                support: string[];
            };
            mgmt_port: number;
            model: string;
            role: {
                inbound: number;
                mgmt: number;
            };
        };
    };
    log: {
        s3: unknown[];
    };
    system: {
        dns: string[];
        hostname: string;
        info: {
            cpu_count: number;
            transparent_proxy_enabled: number;
        };
        proxy: unknown[];
        ssh: number;
        sync: {
            acl: unknown[];
            cluster_id: string;
        };
        ap: [];
        captcha: {
            token: {
                key: string;
                iv: string;
            };
        };
        cert_metadata: {
            mgui: [string[]];
        };
        contact: string;
        gateway: string;
        ntp: string[];
        smtp: string;
        timezone: string;
    };
    user: {
        read: {
            read_only: number;
            user_id: string;
            admin: number;
            passwd: string;
            realname: string;
        };
        write: {
            read_only: number;
            user_id: string;
            admin: number;
            passwd: string;
            realname: string;
        };
        admin: {
            status: number;
            admin: number;
            fa: number;
            ll: number;
            passwd: string;
        };
    };
    ver: string[];
    cluster: {
        if: unknown[];
    };
    configured: number;
    license: {
        accepted: string;
        key: string;
        rt: number;
        tt: number;
    };
    migrations: number;
    pf: {
        loopback_mappings: unknown[];
        segmentation: {
            status: number;
            from_to: {
                eth0: {
                    eth0: number;
                };
            };
        };
    };
    signatures_version: string;
    website: {[key:string]:{
        created: string;
        deleted: unknown;
        name: string;
        updated: string;
    }};
}
