
export const remoteConfigKeys = {
    samco_name: 'samco_name',
    samco_address: 'samco_address',
    samco_maps_query: 'samco_maps_query',
    samco_whatsapp: 'samco_whatsapp',
    monitoring_center_name: 'monitoring_center_name',
    monitoring_center_address: 'monitoring_center_address',
    monitoring_center_maps_query: 'monitoring_center_maps_query',
    monitoring_center_phone: 'monitoring_center_phone',
    police_name: 'police_name',
    police_address: 'police_address',
    police_phone: 'police_phone',
    firefighters_name: 'firefighters_name',
    firefighters_address: 'firefighters_address',
    firefighters_phone: 'firefighters_phone',
    ambulance_phone: 'ambulance_phone',
};

export const defaultConfig: Record<string, string> = {
    [remoteConfigKeys.samco_name]: "Samco Armstrong - Guardia 24 hs",
    [remoteConfigKeys.samco_address]: "Pasaje Pedro Rolando 1590, Armstrong, Santa Fe",
    [remoteConfigKeys.samco_maps_query]: "SAMCO+Armstrong,+Pasaje+Pedro+Rolando+1590,+Armstrong,+Santa+Fe",
    [remoteConfigKeys.samco_whatsapp]: "543471533033",
    [remoteConfigKeys.monitoring_center_name]: "Centro de Monitoreo",
    [remoteConfigKeys.monitoring_center_address]: "Bv. Auden y Dante Alighieri",
    [remoteConfigKeys.monitoring_center_maps_query]: "Centro+de+Monitoreo+Armstrong",
    [remoteConfigKeys.monitoring_center_phone]: "109",
    [remoteConfigKeys.police_name]: "Policía",
    [remoteConfigKeys.police_address]: "Comando Radioeléctrico",
    [remoteConfigKeys.police_phone]: "101",
    [remoteConfigKeys.firefighters_name]: "Bomberos Voluntarios",
    [remoteConfigKeys.firefighters_address]: "Dick y Fischer",
    [remoteConfigKeys.firefighters_phone]: "100",
    [remoteConfigKeys.ambulance_phone]: "107",
};

export const CONTACT_DATA = {
    samco: {
        name: defaultConfig[remoteConfigKeys.samco_name],
        address: defaultConfig[remoteConfigKeys.samco_address],
        mapsQuery: defaultConfig[remoteConfigKeys.samco_maps_query],
        whatsapp: defaultConfig[remoteConfigKeys.samco_whatsapp],
    },
    monitoringCenter: {
        name: defaultConfig[remoteConfigKeys.monitoring_center_name],
        address: defaultConfig[remoteConfigKeys.monitoring_center_address],
        mapsQuery: defaultConfig[remoteConfigKeys.monitoring_center_maps_query],
        phone: defaultConfig[remoteConfigKeys.monitoring_center_phone],
    },
    police: {
        name: defaultConfig[remoteConfigKeys.police_name],
        address: defaultConfig[remoteConfigKeys.police_address],
        phone: defaultConfig[remoteConfigKeys.police_phone],
    },
    firefighters: {
        name: defaultConfig[remoteConfigKeys.firefighters_name],
        address: defaultConfig[remoteConfigKeys.firefighters_address],
        phone: defaultConfig[remoteConfigKeys.firefighters_phone],
    },
    ambulance: {
        phone: defaultConfig[remoteConfigKeys.ambulance_phone],
    }
};

export const usefulCenters = [
    CONTACT_DATA.samco,
    CONTACT_DATA.monitoringCenter,
    CONTACT_DATA.police,
    CONTACT_DATA.firefighters,
];
