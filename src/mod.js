"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
const BaseClasses_1 = require("C:/snapshot/project/obj/models/enums/BaseClasses");
const configData = __importStar(require("../config.json"));
class TMS {
    loadingMessages = [
        "Time to bend Tarkovs rules harder than a scav bends to loot",
        "Reshaping Tarkov like a chad reshapes his meta M4",
        "Modifying Tarkov faster than Mechanic modifies guns",
        "Breaking Tarkovs rules like a hatchling breaks containers",
        "Tweaking settings smoother than Reshalas golden TT",
        "Configuring Tarkov harder than a PMC configures his M4",
        "Optimizing Tarkov harder than a rat optimizes his stash",
        "Adjusting settings faster than a chad adjusts his sights",
        "Tweaking Tarkov harder than a PMC tweaks his gear"
    ];
    getRandomLoadingMessage() {
        return this.loadingMessages[Math.floor(Math.random() * this.loadingMessages.length)];
    }
    configServer;
    container;
    constructor() { }
    preSptLoad(container) {
        this.container = container;
        this.configServer = container.resolve("ConfigServer");
    }
    postDBLoad(container) {
        const logger = container.resolve("WinstonLogger");
        const databaseServer = container.resolve("DatabaseServer");
        const globals = databaseServer.getTables().globals.config;
        const tables = databaseServer.getTables();
        const dbItems = tables.templates.items;
        const enemyTypes = tables.bots.types;
        if (configData.EnableLostOnDeath) {
            const dbLODConfig = this.configServer.getConfig(ConfigTypes_1.ConfigTypes.LOST_ON_DEATH);
            dbLODConfig.questItems = configData.LostOnDeath.QuestItems;
            dbLODConfig.specialSlotItems = configData.LostOnDeath.SpecialSlotItems;
            dbLODConfig.equipment.ArmBand = configData.LostOnDeath.ArmBand;
            dbLODConfig.equipment.Headwear = configData.LostOnDeath.Headwear;
            dbLODConfig.equipment.Earpiece = configData.LostOnDeath.Earpiece;
            dbLODConfig.equipment.FaceCover = configData.LostOnDeath.FaceCover;
            dbLODConfig.equipment.ArmorVest = configData.LostOnDeath.ArmorVest;
            dbLODConfig.equipment.Eyewear = configData.LostOnDeath.Eyewear;
            dbLODConfig.equipment.TacticalVest = configData.LostOnDeath.TacticalVest;
            dbLODConfig.equipment.Backpack = configData.LostOnDeath.Backpack;
            dbLODConfig.equipment.Holster = configData.LostOnDeath.Holster;
            dbLODConfig.equipment.Scabbard = configData.LostOnDeath.Scabbard;
            dbLODConfig.equipment.FirstPrimaryWeapon = configData.LostOnDeath.FirstPrimaryWeapon;
            dbLODConfig.equipment.SecondPrimaryWeapon = configData.LostOnDeath.SecondPrimaryWeapon;
            dbLODConfig.equipment.PocketItems = configData.LostOnDeath.PocketItems;
        }
        if (configData.FUInertia) {
            globals.Inertia.BaseJumpPenalty = 0.03;
            globals.Inertia.ExitMovementStateSpeedThreshold.x = 0.001;
            globals.Inertia.ExitMovementStateSpeedThreshold.y = 0.001;
            globals.Inertia.InertiaLimitsStep = 0.1;
            globals.Inertia.MaxTimeWithoutInput.x = 0.01;
            globals.Inertia.MaxTimeWithoutInput.y = 0.03;
            globals.Inertia.PreSprintAccelerationLimits.x = 8;
            globals.Inertia.PreSprintAccelerationLimits.y = 4;
            globals.Inertia.SprintAccelerationLimits.x = 15;
            globals.Inertia.SprintBrakeInertia.y = 0;
            globals.Inertia.SprintTransitionMotionPreservation.x = 0.006;
            globals.Inertia.SprintTransitionMotionPreservation.y = 0.008;
            globals.Inertia.WalkInertia.x = 0.002;
            globals.Inertia.WalkInertia.y = 0.025;
        }
        if (configData.HigherVaulting) {
            globals.VaultingSettings.MovesSettings.ClimbSettings.MoveRestrictions.MaxLength = 17;
            globals.VaultingSettings.MovesSettings.ClimbSettings.MoveRestrictions.MaxHeight = 2.2;
        }
        if (configData.EnableCustomBotsHealth) {
            const enemyTypes = tables.bots.types;
            const bossHealthMultiplierValue = configData.bossHealthMultiplier;
            const followerHealthMultiplierValue = configData.followerHealthMultiplier;
            const specialHealthMultiplierValue = configData.specialHealthMultiplier;
            const pmcHealthMultiplierValue = configData.pmcHealthMultiplier;
            const scavHealthMultiplierValue = configData.scavHealthMultiplier;
            const infectedHealthMultiplierValue = configData.infectedHealthMultiplier;
            for (const key in enemyTypes) {
                if (key.startsWith('boss')) {
                    const bossBot = enemyTypes[key];
                    const bodyParts = bossBot.health.BodyParts[0];
                    for (const bodyPart in bodyParts) {
                        if (bodyParts.hasOwnProperty(bodyPart)) {
                            const partData = bodyParts[bodyPart];
                            partData.min = partData.min * bossHealthMultiplierValue;
                            partData.max = partData.max * bossHealthMultiplierValue;
                        }
                    }
                }
                if (key.startsWith('follower')) {
                    const followerBot = enemyTypes[key];
                    const bodyParts = followerBot.health.BodyParts[0];
                    for (const bodyPart in bodyParts) {
                        if (bodyParts.hasOwnProperty(bodyPart)) {
                            const partData = bodyParts[bodyPart];
                            partData.min = partData.min * followerHealthMultiplierValue;
                            partData.max = partData.max * followerHealthMultiplierValue;
                        }
                    }
                }
                if (key.startsWith('arenafighter') || key.startsWith('sectant') || key.startsWith('exusec') || key.startsWith('pmcbot')) {
                    const specialBot = enemyTypes[key];
                    const bodyParts = specialBot.health.BodyParts[0];
                    for (const bodyPart in bodyParts) {
                        if (bodyParts.hasOwnProperty(bodyPart)) {
                            const partData = bodyParts[bodyPart];
                            partData.min = partData.min * specialHealthMultiplierValue;
                            partData.max = partData.max * specialHealthMultiplierValue;
                        }
                    }
                }
                if (key.startsWith('usec') || key.startsWith('bear') || key.startsWith('pmc') || key.startsWith('peacemaker') || key.startsWith('skier')) {
                    const pmcBot = enemyTypes[key];
                    const bodyParts = pmcBot.health.BodyParts[0];
                    for (const bodyPart in bodyParts) {
                        if (bodyParts.hasOwnProperty(bodyPart)) {
                            const partData = bodyParts[bodyPart];
                            partData.min = partData.min * pmcHealthMultiplierValue;
                            partData.max = partData.max * pmcHealthMultiplierValue;
                        }
                    }
                }
                if (key.startsWith('assault') || key.startsWith('cursedassault') || key.startsWith('crazyassaultevent')) {
                    const scavBot = enemyTypes[key];
                    const bodyParts = scavBot.health.BodyParts[0];
                    for (const bodyPart in bodyParts) {
                        if (bodyParts.hasOwnProperty(bodyPart)) {
                            const partData = bodyParts[bodyPart];
                            partData.min = partData.min * scavHealthMultiplierValue;
                            partData.max = partData.max * scavHealthMultiplierValue;
                        }
                    }
                }
                if (key.startsWith('infected')) {
                    const infectedBot = enemyTypes[key];
                    const bodyParts = infectedBot.health.BodyParts[0];
                    for (const bodyPart in bodyParts) {
                        if (bodyParts.hasOwnProperty(bodyPart)) {
                            const partData = bodyParts[bodyPart];
                            partData.min = partData.min * infectedHealthMultiplierValue;
                            partData.max = partData.max * infectedHealthMultiplierValue;
                        }
                    }
                }
            }
        }
        if (configData.MakeAllHeadsetsGood) {
            const headsetValues = configData.HeadsetValues;
            for (const item in dbItems) {
                if (dbItems[item]._parent === BaseClasses_1.BaseClasses.HEADPHONES) {
                    const itemProps = dbItems[item]._props;
                    itemProps.Distortion = headsetValues.Distortion;
                    itemProps.CompressorTreshold = headsetValues.CompressorTreshold;
                    itemProps.CompressorAttack = headsetValues.CompressorAttack;
                    itemProps.CompressorRelease = headsetValues.CompressorRelease;
                    itemProps.CompressorGain = headsetValues.CompressorGain;
                    itemProps.Resonance = headsetValues.Resonance;
                    itemProps.AmbientVolume = headsetValues.AmbientVolume;
                    itemProps.DryVolume = headsetValues.DryVolume;
                    itemProps.RolloffMultiplier = headsetValues.RolloffMultiplier;
                    itemProps.HighpassFreq = headsetValues.HighpassFreq;
                    itemProps.HighpassResonance = headsetValues.HighpassResonance;
                    itemProps.LowpassFreq = headsetValues.LowpassFreq;
                    itemProps.EQBand1Frequency = headsetValues.EQBand1Frequency;
                    itemProps.EQBand1Gain = headsetValues.EQBand1Gain;
                    itemProps.EQBand1Q = headsetValues.EQBand1Q;
                    itemProps.EQBand2Frequency = headsetValues.EQBand2Frequency;
                    itemProps.EQBand2Gain = headsetValues.EQBand2Gain;
                    itemProps.EQBand2Q = headsetValues.EQBand2Q;
                    itemProps.EQBand3Frequency = headsetValues.EQBand3Frequency;
                    itemProps.EQBand3Gain = headsetValues.EQBand3Gain;
                    itemProps.EQBand3Q = headsetValues.EQBand3Q;
                    itemProps.EffectsReturnsCompressorSendLevel = headsetValues.EffectsReturnsCompressorSendLevel;
                    itemProps.EffectsReturnsGroupVolume = headsetValues.EffectsReturnsGroupVolume;
                    itemProps.EnvCommonCompressorSendLevel = headsetValues.EnvCommonCompressorSendLevel;
                    itemProps.EnvNatureCompressorSendLevel = headsetValues.EnvNatureCompressorSendLevel;
                    itemProps.EnvTechnicalCompressorSendLevel = headsetValues.EnvTechnicalCompressorSendLevel;
                    itemProps.GunsCompressorSendLevel = headsetValues.GunsCompressorSendLevel;
                    itemProps.HeadphonesMixerVolume = headsetValues.HeadphonesMixerVolume;
                    itemProps.AmbientCompressorSendLevel = headsetValues.AmbientCompressorSendLevel;
                    itemProps.ClientPlayerCompressorSendLevel = headsetValues.ClientPlayerCompressorSendLevel;
                }
            }
        }
        if (configData.MakeRepairKitLessOverpowered) {
            const ArmorRepairKit = "591094e086f7747caa7bb2ef";
            const ArmorRepair = dbItems[ArmorRepairKit];
            ArmorRepair._props.MaxRepairResource = configData.ArmorRepairKitMaxResource;
            const WeaponRepairKit = "5910968f86f77425cf569c32";
            const WeaponRepair = dbItems[WeaponRepairKit];
            WeaponRepair._props.MaxRepairResource = configData.WeaponRepairKitMaxResource;
        }
        if (configData.ColouredAmmo) {
            for (const item in dbItems) {
                if (dbItems[item]._parent === BaseClasses_1.BaseClasses.AMMO) {
                    const itemProps = dbItems[item]._props;
                    const pen = itemProps.PenetrationPower;
                    let colour = '';
                    if (pen > 60) {
                        colour = 'red'; // SuperPen
                    }
                    else if (pen > 50) {
                        colour = 'yellow'; // HighPen
                    }
                    else if (pen > 40) {
                        colour = 'violet'; // MedHighPen
                    }
                    else if (pen > 30) {
                        colour = 'blue'; // MedPen
                    }
                    else if (pen > 20) {
                        colour = 'green'; // LowMedPen
                    }
                    else {
                        colour = 'grey'; // LowPen
                    }
                    itemProps.BackgroundColor = colour;
                    if (configData.WeightlessAmmo) {
                        itemProps.Weight = 0;
                    }
                }
            }
        }
        if (configData.DisableMagazineAmmoLoadPenalty) {
            for (const item in dbItems) {
                if (dbItems[item]._parent === BaseClasses_1.BaseClasses.MAGAZINE) {
                    const itemProps = dbItems[item]._props;
                    itemProps.LoadUnloadModifier = 0;
                }
            }
        }
        if (configData.AdjustBotGrenades) {
            const botGrenadePrecisionValue = Math.max(0, configData.BotGrenadePrecision);
            const botGrenadePerMeterValue = Math.max(0, configData.BotGrenadePerMeter);
            try {
                for (const key in enemyTypes) {
                    if (!enemyTypes.hasOwnProperty(key))
                        continue;
                    const bot = enemyTypes[key];
                    const difficulties = bot?.difficulty;
                    if (difficulties) {
                        ['easy', 'normal', 'hard', 'impossible'].forEach(level => {
                            if (difficulties[level]?.Grenade) {
                                difficulties[level].Grenade.GrenadePrecision = botGrenadePrecisionValue;
                                difficulties[level].Grenade.GrenadePerMeter = botGrenadePerMeterValue;
                            }
                        });
                    }
                }
            }
            catch (error) {
                logger.error(`Error adjusting bot grenades: ${error.message}`);
            }
        }
        if (configData.MakeForegripsEqual) {
            const ForegripsErgo = configData.ForegripsErgo;
            const ForegripsRecoil = configData.ForegripsRecoil;
            try {
                for (const item in dbItems) {
                    if (!dbItems.hasOwnProperty(item))
                        continue;
                    const currentItem = dbItems[item];
                    if (!currentItem?._props)
                        continue;
                    if (currentItem._parent === BaseClasses_1.BaseClasses.FOREGRIP) {
                        currentItem._props.Ergonomics = ForegripsErgo;
                        currentItem._props.Recoil = ForegripsRecoil;
                    }
                }
            }
            catch (error) {
                logger.error(`Error adjusting foregrips: ${error.message}`);
            }
        }
        if (configData.FixExtraSize) {
            for (const item in dbItems) {
                if (dbItems[item]._parent === BaseClasses_1.BaseClasses.MAGAZINE) {
                    const itemProps = dbItems[item]._props;
                    if (dbItems[item]._id == "6513f0a194c72326990a3868") {
                        itemProps.ExtraSizeDown = 0;
                    }
                    if (dbItems[item]._id == "646372518610c40fc20204e8") {
                        itemProps.ExtraSizeDown = 1;
                    }
                    if (configData.FixExtraSizeExtendedMags) {
                        if (itemProps.Height === 3 && itemProps.Width === 1) {
                            itemProps.ExtraSizeDown = 1;
                            if (configData.ExtendedMagsTwoSlotsHeight) {
                                itemProps.Height = 2;
                            }
                        }
                    }
                }
                if (dbItems[item]._parent === BaseClasses_1.BaseClasses.MOUNT) {
                    const itemProps = dbItems[item]._props;
                    if (dbItems[item]._id == "5a37ca54c4a282000d72296a") {
                        itemProps.ExtraSizeUp = 0;
                    }
                    if (dbItems[item]._id == "5aa66c72e5b5b00016327c93") {
                        itemProps.ExtraSizeUp = 0;
                    }
                    if (dbItems[item]._id == "61713cc4d8e3106d9806c109") {
                        itemProps.ExtraSizeUp = 0;
                    }
                    if (dbItems[item]._id == "6171407e50224f204c1da3c5") {
                        itemProps.ExtraSizeUp = 0;
                    }
                }
            }
        }
        if (configData.EnableCustomBotCaps) {
            const dbBotConfig = this.configServer.getConfig(ConfigTypes_1.ConfigTypes.BOT);
            dbBotConfig.maxBotCap.factory4_day = configData.MaxBotCaps.factory4_day;
            dbBotConfig.maxBotCap.factory4_night = configData.MaxBotCaps.factory4_night;
            dbBotConfig.maxBotCap.bigmap = configData.MaxBotCaps.bigmap;
            dbBotConfig.maxBotCap.woods = configData.MaxBotCaps.woods;
            dbBotConfig.maxBotCap.shoreline = configData.MaxBotCaps.shoreline;
            dbBotConfig.maxBotCap.lighthouse = configData.MaxBotCaps.lighthouse;
            dbBotConfig.maxBotCap.rezervbase = configData.MaxBotCaps.rezervbase;
            dbBotConfig.maxBotCap.interchange = configData.MaxBotCaps.interchange;
            dbBotConfig.maxBotCap.laboratory = configData.MaxBotCaps.laboratory;
            dbBotConfig.maxBotCap.tarkovstreets = configData.MaxBotCaps.tarkovstreets;
            dbBotConfig.maxBotCap.sandbox = configData.MaxBotCaps.sandbox;
            dbBotConfig.maxBotCap.sandbox_high = configData.MaxBotCaps.sandbox_high;
            dbBotConfig.maxBotCap.default = configData.MaxBotCaps.default;
        }
        if (configData.EnableMoreItemsSicc) {
            const SICC = tables.templates.items["5d235bb686f77443f4331278"];
            const filterArray = SICC["_props"]["Grids"][0]["_props"]["filters"][0]["Filter"];
            const newValuesToAdd = configData.AddTheseToPouch;
            filterArray.push(...newValuesToAdd);
        }
        if (configData.LegaMedalInsideMoneyCase) {
            const MONEYCASE = tables.templates.items["59fb016586f7746d0d4b423a"];
            const filterArray = MONEYCASE["_props"]["Grids"][0]["_props"]["filters"][0]["Filter"];
            filterArray.push("6656560053eaaa7a23349c86");
        }
        logger.info("---------------------------------------------------");
        logger.info(`TMS Loaded - ${this.getRandomLoadingMessage()}`);
        logger.info("---------------------------------------------------");
    }
}
module.exports = { mod: new TMS() };
//# sourceMappingURL=mod.js.map