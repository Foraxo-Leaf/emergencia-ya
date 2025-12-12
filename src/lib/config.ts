

import { educationTopics } from "@/lib/data/educationData";

export const REMOTE_CONFIG_SCHEMA_VERSION = 1;
export const REMOTE_CONFIG_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
export const SMS_MAPS_URL_PLACEHOLDER = "{{mapsUrl}}";
export const SMS_COORDS_PLACEHOLDER = "{{coords}}";
export const SMS_LAT_PLACEHOLDER = "{{lat}}";
export const SMS_LON_PLACEHOLDER = "{{lon}}";

// Generates keys with underscores for Firebase parameter names
const generateEducationVideoKeys = () => {
    const keys: Record<string, string> = {};
    educationTopics.forEach(topic => {
        const key = `education_video_${topic.slug.replace(/-/g, '_')}`;
        keys[key] = key; // The key and value are the same here, just for consistency
    });
    return keys;
};


export const remoteConfigKeys = {
    samco_name: 'samco_name',
    samco_address: 'samco_address',
    samco_maps_query: 'samco_maps_query',
    samco_whatsapp: 'samco_whatsapp',
    samco_sms_phone: 'samco_sms_phone',
    sms_help_body_template: 'sms_help_body_template',
    offline_ambulance_phone: 'offline_ambulance_phone',
    offline_monitoring_center_phone: 'offline_monitoring_center_phone',
    offline_police_phone: 'offline_police_phone',
    offline_firefighters_phone: 'offline_firefighters_phone',
    monitoring_center_name: 'monitoring_center_name',
    monitoring_center_address: 'monitoring_center_address',
    monitoring_center_maps_query: 'monitoring_center_maps_query',
    monitoring_center_phone: 'monitoring_center_phone',
    police_name: 'police_name',
    police_address: 'police_address',
    police_maps_query: 'police_maps_query',
    police_phone: 'police_phone',
    firefighters_name: 'firefighters_name',
    firefighters_address: 'firefighters_address',
    firefighters_maps_query: 'firefighters_maps_query',
    firefighters_phone: 'firefighters_phone',
    ambulance_phone: 'ambulance_phone',
    geofence_center_lat: 'geofence_center_lat',
    geofence_center_lon: 'geofence_center_lon',
    geofence_radius_km: 'geofence_radius_km',
    ...generateEducationVideoKeys()
};

export const defaultConfig: Record<string, string> = {
    [remoteConfigKeys.samco_name]: "Samco Armstrong - Guardia 24 hs",
    [remoteConfigKeys.samco_address]: "Pasaje Pedro Rolando 1590, Armstrong, Santa Fe",
    [remoteConfigKeys.samco_maps_query]: "SAMCO+Armstrong,+Pasaje+Pedro+Rolando+1590,+Armstrong,+Santa+Fe",
    [remoteConfigKeys.samco_whatsapp]: "543471533033",
    [remoteConfigKeys.samco_sms_phone]: "543471533033",
    [remoteConfigKeys.sms_help_body_template]: `Necesito ayuda. Mi ubicación es: ${SMS_MAPS_URL_PLACEHOLDER}`,
    [remoteConfigKeys.offline_ambulance_phone]: "107",
    [remoteConfigKeys.offline_monitoring_center_phone]: "109",
    [remoteConfigKeys.offline_police_phone]: "101",
    [remoteConfigKeys.offline_firefighters_phone]: "100",
    [remoteConfigKeys.monitoring_center_name]: "Centro de Monitoreo",
    [remoteConfigKeys.monitoring_center_address]: "Bv. Auden y Dante Alighieri",
    [remoteConfigKeys.monitoring_center_maps_query]: "Centro+de+Monitoreo+Armstrong",
    [remoteConfigKeys.monitoring_center_phone]: "109",
    [remoteConfigKeys.police_name]: "Policía",
    [remoteConfigKeys.police_address]: "Comando Radioeléctrico",
    [remoteConfigKeys.police_maps_query]: "Comando+Radioeléctrico+Armstrong",
    [remoteConfigKeys.police_phone]: "101",
    [remoteConfigKeys.firefighters_name]: "Bomberos Voluntarios",
    [remoteConfigKeys.firefighters_address]: "Dick y Fischer",
    [remoteConfigKeys.firefighters_maps_query]: "Bomberos+Voluntarios+Armstrong",
    [remoteConfigKeys.firefighters_phone]: "100",
    [remoteConfigKeys.ambulance_phone]: "107",
    [remoteConfigKeys.geofence_center_lat]: "-32.7833", // Centro de Armstrong
    [remoteConfigKeys.geofence_center_lon]: "-61.6",
    [remoteConfigKeys.geofence_radius_km]: "10",
    ...educationTopics.reduce((acc, topic) => {
        const key = `education_video_${topic.slug.replace(/-/g, '_')}`;
        acc[key] = ""; // Default to empty string
        return acc;
    }, {} as Record<string, string>)
};

type SamcoData = {
    name: string;
    address: string;
    mapsQuery: string;
    whatsapp: string;
    smsPhone: string;
};

type CenterData = {
    name: string;
    address: string;
    mapsQuery?: string;
    phone: string;
};

type GeofenceData = {
    center: { lat: number; lon: number; };
    radiusKm: number;
}

type OfflinePhonesData = {
    ambulance: string;
    monitoringCenter: string;
    police: string;
    firefighters: string;
};

type SmsConfig = {
    helpBodyTemplate: string;
};

export type ContactData = {
    samco: SamcoData;
    monitoringCenter: CenterData;
    police: CenterData;
    firefighters: CenterData;
    ambulance: {
        phone: string;
    },
    offlinePhones: OfflinePhonesData;
    sms: SmsConfig;
    educationVideos: Record<string, string>;
    geofence: GeofenceData;
};

export const buildContactData = (config: Record<string, string>): ContactData => ({
    samco: {
        name: config[remoteConfigKeys.samco_name],
        address: config[remoteConfigKeys.samco_address],
        mapsQuery: config[remoteConfigKeys.samco_maps_query],
        whatsapp: config[remoteConfigKeys.samco_whatsapp],
        smsPhone: config[remoteConfigKeys.samco_sms_phone] || config[remoteConfigKeys.samco_whatsapp],
    },
    monitoringCenter: {
        name: config[remoteConfigKeys.monitoring_center_name],
        address: config[remoteConfigKeys.monitoring_center_address],
        mapsQuery: config[remoteConfigKeys.monitoring_center_maps_query],
        phone: config[remoteConfigKeys.monitoring_center_phone],
    },
    police: {
        name: config[remoteConfigKeys.police_name],
        address: config[remoteConfigKeys.police_address],
        mapsQuery: config[remoteConfigKeys.police_maps_query],
        phone: config[remoteConfigKeys.police_phone],
    },
    firefighters: {
        name: config[remoteConfigKeys.firefighters_name],
        address: config[remoteConfigKeys.firefighters_address],
        mapsQuery: config[remoteConfigKeys.firefighters_maps_query],
        phone: config[remoteConfigKeys.firefighters_phone],
    },
    ambulance: {
        phone: config[remoteConfigKeys.ambulance_phone],
    },
    offlinePhones: {
        ambulance: config[remoteConfigKeys.offline_ambulance_phone],
        monitoringCenter: config[remoteConfigKeys.offline_monitoring_center_phone],
        police: config[remoteConfigKeys.offline_police_phone],
        firefighters: config[remoteConfigKeys.offline_firefighters_phone],
    },
    sms: {
        helpBodyTemplate: config[remoteConfigKeys.sms_help_body_template],
    },
    educationVideos: educationTopics.reduce((acc, topic) => {
        const remoteConfigKey = `education_video_${topic.slug.replace(/-/g, '_')}`;
        acc[topic.slug] = config[remoteConfigKey] || "";
        return acc;
    }, {} as Record<string, string>),
    geofence: {
        center: {
            lat: parseFloat(config[remoteConfigKeys.geofence_center_lat]),
            lon: parseFloat(config[remoteConfigKeys.geofence_center_lon]),
        },
        radiusKm: parseInt(config[remoteConfigKeys.geofence_radius_km], 10),
    }
});

export const CONTACT_DATA = buildContactData(defaultConfig);
