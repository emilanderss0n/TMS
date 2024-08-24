import { DependencyContainer } from "tsyringe"
import { ILogger } from "@spt/models/spt/utils/ILogger"
import { IPreSptLoadMod } from "@spt/models/external/IPreSptLoadMod"
import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod"
import { DatabaseServer } from "@spt/servers/DatabaseServer"
import { ConfigServer } from "@spt/servers/ConfigServer"
import { ConfigTypes } from "@spt/models/enums/ConfigTypes"
import { BaseClasses } from "@spt/models/enums/BaseClasses"

import * as configData from "../config.json"

class TMS implements IPreSptLoadMod, IPostDBLoadMod
{
    public configServer: ConfigServer
    public container: DependencyContainer

    constructor() {}

    public preSptLoad(container: DependencyContainer, mod: string): void
    {
      this.container = container
      this.configServer = container.resolve<ConfigServer>("ConfigServer")
    }
    
    public postDBLoad(container: DependencyContainer): void 
    {
        const logger = container.resolve<ILogger>("WinstonLogger");

        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer")
        const globals = databaseServer.getTables().globals.config
        const tables = databaseServer.getTables()
        const dbItems = tables.templates.items

        
        if (configData.EnableLostOnDeath) {
          const dbLODConfig = this.configServer.getConfig<ILostOnDeathConfig>(ConfigTypes.LOST_ON_DEATH)
          dbLODConfig.questItems = configData.LostOnDeath.QuestItems
          dbLODConfig.equipment.ArmBand = configData.LostOnDeath.ArmBand
          dbLODConfig.equipment.Compass = configData.LostOnDeath.Compass
          dbLODConfig.equipment.Headwear = configData.LostOnDeath.Headwear
          dbLODConfig.equipment.Earpiece = configData.LostOnDeath.Earpiece
          dbLODConfig.equipment.FaceCover = configData.LostOnDeath.FaceCover
          dbLODConfig.equipment.ArmorVest = configData.LostOnDeath.ArmorVest
          dbLODConfig.equipment.Eyewear = configData.LostOnDeath.Eyewear
          dbLODConfig.equipment.TacticalVest = configData.LostOnDeath.TacticalVest
          dbLODConfig.equipment.Backpack = configData.LostOnDeath.Backpack
          dbLODConfig.equipment.Holster = configData.LostOnDeath.Holster
          dbLODConfig.equipment.Scabbard = configData.LostOnDeath.Scabbard
          dbLODConfig.equipment.FirstPrimaryWeapon = configData.LostOnDeath.FirstPrimaryWeapon
          dbLODConfig.equipment.SecondPrimaryWeapon = configData.LostOnDeath.SecondPrimaryWeapon
        }

        if (configData.FUInertia) {
          globals.Inertia.BaseJumpPenalty = 0.03
          globals.Inertia.CrouchSpeedAccelerationRange.x = 2.75
          globals.Inertia.CrouchSpeedAccelerationRange.y = 4.5
          globals.Inertia.ExitMovementStateSpeedThreshold.x = 0.001
          globals.Inertia.ExitMovementStateSpeedThreshold.y = 0.001
          globals.Inertia.InertiaLimitsStep = 0.1
          globals.Inertia.MaxTimeWithoutInput.x = 0.01
          globals.Inertia.MaxTimeWithoutInput.y = 0.03
          globals.Inertia.PreSprintAccelerationLimits.x = 8
          globals.Inertia.PreSprintAccelerationLimits.y = 4
          globals.Inertia.SprintAccelerationLimits.x = 15
          globals.Inertia.SprintBrakeInertia.y = 0
          globals.Inertia.SprintTransitionMotionPreservation.x = 0.006
          globals.Inertia.SprintTransitionMotionPreservation.y = 0.008
          globals.Inertia.WalkInertia.x = 0.002
          globals.Inertia.WalkInertia.y = 0.025
        }

        if (configData.HigherVaulting) {
            globals.VaultingSettings.MovesSettings.ClimbSettings.MoveRestrictions.MaxLength = 17;
            globals.VaultingSettings.MovesSettings.ClimbSettings.MoveRestrictions.MaxHeight = 2.2;
        }

        if (configData.EnableCustomBotsHealth)
        {
          const enemyTypes = tables.bots.types;

          const bossHealthMultiplierValue = configData.bossHealthMultiplier;
          const followerHealthMultiplierValue = configData.followerHealthMultiplier;
          const specialHealthMultiplierValue = configData.specialHealthMultiplier;
          const pmcHealthMultiplierValue = configData.pmcHealthMultiplier;
          const scavHealthMultiplierValue = configData.scavHealthMultiplier;
  
          for (const key in enemyTypes) {
              if (key.startsWith('boss')) {
  
                  const bossBot = enemyTypes[key]
  
                  const bodyParts = bossBot.health.BodyParts[0]
                  for (const bodyPart in bodyParts) {
                      if (bodyParts.hasOwnProperty(bodyPart)) {
                          const partData = bodyParts[bodyPart]
                          partData.min = partData.min * bossHealthMultiplierValue
                          partData.max = partData.max * bossHealthMultiplierValue
                      }
                  }
              }
              if (key.startsWith('follower')) {
  
                  const followerBot = enemyTypes[key]
  
                  const bodyParts = followerBot.health.BodyParts[0]
                  for (const bodyPart in bodyParts) {
                      if (bodyParts.hasOwnProperty(bodyPart)) {
                          const partData = bodyParts[bodyPart]
                      
                          partData.min = partData.min * followerHealthMultiplierValue
                          partData.max = partData.max * followerHealthMultiplierValue
                      }
                  }
              }
              // Bloodhounds, Cultists, Rogues, Raiders
              if (key.startsWith('arenafighter') || key.startsWith('sectant') || key.startsWith('exusec') || key.startsWith('pmcbot')) {
  
                  const specialBot = enemyTypes[key]
  
                  const bodyParts = specialBot.health.BodyParts[0]
                  for (const bodyPart in bodyParts) {
                      if (bodyParts.hasOwnProperty(bodyPart)) {
                          const partData = bodyParts[bodyPart]
                      
                          partData.min = partData.min * specialHealthMultiplierValue
                          partData.max = partData.max * specialHealthMultiplierValue
                      }
                  }
              }
              // PMC
              if (key.startsWith('usec') || key.startsWith('bear') || key.startsWith('pmc')) {
  
                  const pmcBot = enemyTypes[key]
  
                  const bodyParts = pmcBot.health.BodyParts[0]
                  for (const bodyPart in bodyParts) {
                      if (bodyParts.hasOwnProperty(bodyPart)) {
                          const partData = bodyParts[bodyPart]
                      
                          partData.min = partData.min * pmcHealthMultiplierValue
                          partData.max = partData.max * pmcHealthMultiplierValue
                      }
                  }
              }
              // Scavs
              if (key.startsWith('assault') || key.startsWith('cursedassault') || key.startsWith('crazyassaultevent')) {
  
                  const scavBot = enemyTypes[key]
  
                  const bodyParts = scavBot.health.BodyParts[0]
                  for (const bodyPart in bodyParts) {
                      if (bodyParts.hasOwnProperty(bodyPart)) {
                          const partData = bodyParts[bodyPart]
                      
                          partData.min = partData.min * scavHealthMultiplierValue
                          partData.max = partData.max * scavHealthMultiplierValue
                      }
                  }
              }
          }
        }

        if (configData.MakeAllHeadsetsGood) {
            const headsetValues = configData.HeadsetValues
            for (const item in dbItems) {
              if (dbItems[item]._parent == BaseClasses.HEADPHONES) {
                const itemProps = dbItems[item]._props
                itemProps.Distortion = headsetValues.Distortion
                itemProps.CompressorTreshold = headsetValues.CompressorTreshold
                itemProps.CompressorAttack = headsetValues.CompressorAttack
                itemProps.CompressorRelease = headsetValues.CompressorRelease
                itemProps.CompressorGain = headsetValues.CompressorGain
                itemProps.CutoffFreq = headsetValues.CutoffFreq
                itemProps.Resonance = headsetValues.Resonance
                itemProps.CompressorVolume = headsetValues.CompressorVolume
                itemProps.AmbientVolume = headsetValues.AmbientVolume
                itemProps.DryVolume = headsetValues.DryVolume
                itemProps.RolloffMultiplier = headsetValues.RolloffMultiplier
                itemProps.HighFrequenciesGain = headsetValues.HighFrequenciesGain
                itemProps.ReverbVolume = headsetValues.ReverbVolume
              }
            }
        }

        if (configData.MakeRepairKitLessOverpowered)
        {
          const ArmorRepairKit = "591094e086f7747caa7bb2ef"
          const ArmorRepair = dbItems[ArmorRepairKit]
          ArmorRepair._props.MaxRepairResource = configData.ArmorRepairKitMaxResource

          const WeaponRepairKit = "5910968f86f77425cf569c32"
          const WeaponRepair = dbItems[WeaponRepairKit]
          WeaponRepair._props.MaxRepairResource = configData.WeaponRepairKitMaxResource
        }

        if (configData.ColouredAmmo) {
          for (const item in dbItems) {
            if (dbItems[item]._parent == BaseClasses.AMMO) {
                const itemProps = dbItems[item]._props
                let pen = itemProps.PenetrationPower
                let colour = ''
    
                pen > 60 ? colour = 'red' : //SuperPen 
                pen > 50 ? colour = 'yellow' : //HighPen 
                pen > 40 ? colour = 'violet' : //MedHighPen 
                pen > 30 ? colour = 'blue' : //MedPen 
                pen > 20 ? colour = 'green' : //LowMedPen 
                colour = 'grey' //LowPen 

                itemProps.BackgroundColor = colour
            }
          }
        }

        if (configData.DisableMagazineAmmoLoadPenalty) {
            for (const item in dbItems) {
                if (dbItems[item]._parent == BaseClasses.MAGAZINE) {
                    const itemProps = dbItems[item]._props
                    itemProps.LoadUnloadModifier = 0
                }
            }
        }

        if (configData.StopSendingKilledVictimMessages) {
          const pmcchatvictimServer = container.resolve("ConfigServer").configs["spt-pmcchatresponse"];
          pmcchatvictimServer["victim"] =
          {
              "responseChancePercent": 0,
              "responseTypeWeights": {
                  "positive": 0,
                  "negative": 0,
                  "plead": 0
              },
              "stripCapitalisationChancePercent": 0,
              "allCapsChancePercent": 0,
              "appendBroToMessageEndChancePercent": 0
          }
          const pmcchatkillerServer = container.resolve("ConfigServer").configs["spt-pmcchatresponse"];
          pmcchatkillerServer["killer"] =
          {
              "responseChancePercent": 0,
              "responseTypeWeights": {
                  "positive": 0,
                  "negative": 0,
                  "plead": 0
              },
              "stripCapitalisationChancePercent": 0,
              "allCapsChancePercent": 0,
              "appendBroToMessageEndChancePercent": 0
          }
        }

        logger.info("---------------------------------------------------")
        logger.info("TMS - Loaded (60% of the time, it works every time)")
        logger.info("---------------------------------------------------")
      }
}

module.exports = { mod: new TMS() }