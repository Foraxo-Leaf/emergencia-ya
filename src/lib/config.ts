
import { educationTopics } from "./educationData";

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
    police_maps_query: 'police_maps_query',
    police_phone: 'police_phone',
    firefighters_name: 'firefighters_name',
    firefighters_address: 'firefighters_address',
    firefighters_maps_query: 'firefighters_maps_query',
    firefighters_phone: 'firefighters_phone',
    ambulance_phone: 'ambulance_phone',
    ...educationTopics.reduce((acc, topic) => {
        acc[`education_video_${topic.slug}`] = `education_video_${topic.slug}`;
        return acc;
    }, {} as Record<string, string>)
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
    [remoteConfigKeys.police_maps_query]: "Comando+Radioeléctrico+Armstrong",
    [remoteConfigKeys.police_phone]: "101",
    [remoteConfigKeys.firefighters_name]: "Bomberos Voluntarios",
    [remoteConfigKeys.firefighters_address]: "Dick y Fischer",
    [remoteConfigKeys.firefighters_maps_query]: "Bomberos+Voluntarios+Armstrong",
    [remoteConfigKeys.firefighters_phone]: "100",
    [remoteConfigKeys.ambulance_phone]: "107",
    ...educationTopics.reduce((acc, topic) => {
        acc[`education_video_${topic.slug}`] = ""; // Default to empty string
        return acc;
    }, {} as Record<string, string>)
};

type SamcoData = {
    name: string;
    address: string;
    mapsQuery: string;
    whatsapp: string;
};

type CenterData = {
    name: string;
    address: string;
    mapsQuery?: string;
    phone: string;
};

export type ContactData = {
    samco: SamcoData;
    monitoringCenter: CenterData;
    police: CenterData;
    firefighters: CenterData;
    ambulance: {
        phone: string;
    },
    educationVideos: Record<string, string>;
};

export const buildContactData = (config: Record<string, string>): ContactData => ({
    samco: {
        name: config[remoteConfigKeys.samco_name],
        address: config[remoteConfigKeys.samco_address],
        mapsQuery: config[remoteConfigKeys.samco_maps_query],
        whatsapp: config[remoteConfigKeys.samco_whatsapp],
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
    educationVideos: educationTopics.reduce((acc, topic) => {
        acc[topic.slug] = config[`education_video_${topic.slug}`] || "";
        return acc;
    }, {} as Record<string, string>)
});

export const CONTACT_DATA = buildContactData(defaultConfig);
