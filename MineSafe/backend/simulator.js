import { config } from './config.js';
import { db } from './database.js';

class SimulatorEngine {
  constructor() {
    this.isPlaying = true;
    this.speedMs = 2000;
    this.activeScenario = 'APPROACHING_VEHICLE';
    this.tickCount = 0;
    this.timer = null;
    this.telemetryCallback = null;

    // Temporal progression state
    this.temporal = {
      // Approach sequence: 60m -> 52m -> 43m -> 34m -> 25m -> 18m -> 8m -> 3.2m
      approachDistanceSequence: [60.0, 52.4, 43.1, 34.0, 25.2, 18.0, 11.5, 6.2, 3.2, 2.8, 3.2, 5.0, 8.5, 14.0],
      approachIndex: 0,
      tiltPitchSequence: [2.0, 5.0, 9.0, 14.0, 19.5, 22.0, 18.0, 10.0, 4.0],
      tiltIndex: 0,
    };
  }

  setTelemetryCallback(cb) {
    this.telemetryCallback = cb;
  }

  start() {
    this.isPlaying = true;
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      if (this.isPlaying) {
        this.tick();
      }
    }, this.speedMs);
    console.log(`⏱️ Simulation engine started [Scenario: ${this.activeScenario}, Interval: ${this.speedMs}ms]`);
  }

  stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    console.log('⏸️ Simulation engine paused');
  }

  reset() {
    this.tickCount = 0;
    this.temporal.approachIndex = 0;
    this.temporal.tiltIndex = 0;
    this.setScenario('NORMAL_OPERATION');
  }

  setScenario(scenario) {
    this.activeScenario = scenario;
    this.temporal.approachIndex = 0;
    this.temporal.tiltIndex = 0;
    console.log(`🎬 Simulation scenario switched to: ${scenario}`);
    // Immediate tick to reflect change
    this.tick();
  }

  setSpeed(speedMs) {
    this.speedMs = Math.max(500, Math.min(10000, speedMs));
    if (this.isPlaying) {
      this.start();
    }
  }

  /**
   * Main temporal state evolution cycle.
   */
  async tick() {
    this.tickCount++;

    const vehicles = await db.getVehicles();
    const d104 = vehicles.find((v) => v.code === 'D-104') || vehicles[0];
    const d108 = vehicles.find((v) => v.code === 'D-108');
    const p301 = vehicles.find((v) => v.code === 'P-301');

    if (!d104) return;

    let distanceM = 25.0;
    let closingSpeedKmh = 0;
    let pitch = 2.1;
    let roll = 1.0;
    let visibilityM = 25.0;
    let fogLevelPercent = 10;
    let humidityPercent = 60;
    let d104Speed = 16;
    let scenarioName = this.activeScenario;

    // Temporal State Machine per Scenario
    switch (this.activeScenario) {
      case 'NORMAL_OPERATION':
      case 'NORMAL':
        distanceM = 28.5;
        closingSpeedKmh = 2.0;
        pitch = 2.0;
        roll = 1.0;
        visibilityM = 25.0;
        fogLevelPercent = 10;
        humidityPercent = 55;
        d104Speed = 16;
        break;

      case 'DENSE_FOG':
      case 'FOG_EVENT':
      case 'LOW_VISIBILITY':
        visibilityM = Math.max(3.2, 15.0 - (this.tickCount % 12) * 1.0);
        fogLevelPercent = Math.min(88, 50 + (this.tickCount % 12) * 3);
        humidityPercent = 90;
        distanceM = 18.0;
        closingSpeedKmh = 8.0;
        d104Speed = 14;
        break;

      case 'APPROACHING_VEHICLE':
      case 'COLLISION_RISK':
      case 'UNSAFE_DISTANCE': {
        const seq = this.temporal.approachDistanceSequence;
        distanceM = seq[this.temporal.approachIndex % seq.length];
        this.temporal.approachIndex++;
        closingSpeedKmh = distanceM < 10 ? 28 : distanceM < 20 ? 18 : 8;
        visibilityM = 3.5;
        fogLevelPercent = 82;
        humidityPercent = 88;
        d104Speed = distanceM < 5 ? 18 : 16; // Hasn't slowed down yet
        break;
      }

      case 'HIGH_TILT': {
        const tSeq = this.temporal.tiltPitchSequence;
        pitch = tSeq[this.temporal.tiltIndex % tSeq.length];
        roll = parseFloat((pitch * 0.75).toFixed(1));
        this.temporal.tiltIndex++;
        distanceM = 22.0;
        visibilityM = 8.0;
        fogLevelPercent = 45;
        break;
      }

      case 'CRITICAL_PROXIMITY':
      case 'CRITICAL_INCIDENT':
        distanceM = 3.2;
        closingSpeedKmh = 28.0;
        visibilityM = 3.2;
        fogLevelPercent = 85;
        humidityPercent = 92;
        d104Speed = 18;
        break;

      case 'SENSOR_DEGRADATION':
      case 'DEVICE_OFFLINE':
        distanceM = 12.0;
        visibilityM = 4.0;
        fogLevelPercent = 80;
        break;

      default:
        distanceM = 20.0;
    }

    // Vehicle Coordinates along Pit Bench B-4 gradient
    const latOffset = Math.sin(this.tickCount * 0.1) * 0.0003;
    const lngOffset = Math.cos(this.tickCount * 0.1) * 0.0003;

    // Telemetry payload matching unified contract
    const simulatedTelemetry = {
      vehicleId: d104.id,
      vehicleCode: d104.code,
      siteId: d104.siteId,
      zoneId: d104.zoneId,
      latitude: parseFloat((18.6325 + latOffset).toFixed(6)),
      longitude: parseFloat((81.2482 + lngOffset).toFixed(6)),
      speedKmh: d104Speed,
      heading: 135,
      fuelLevelPercent: Math.max(20, 80 - Math.floor(this.tickCount * 0.1)),
      engineTempCelsius: 85,
      nearestVehicleId: d108 ? d108.id : 'veh-d108',
      nearestVehicleName: d108 ? d108.name : 'D-108 (Komatsu HD785)',
      nearestVehicleDistanceMeters: distanceM,
      relativeSpeedKmh: closingSpeedKmh,
      pitch,
      roll,
      visibilityMeters: visibilityM,
      fogLevelPercent,
      humidityPercent,
      source: 'SIMULATION',
    };

    // Update D-104 live state in DB cache
    d104.telemetry = {
      ...d104.telemetry,
      ...simulatedTelemetry,
      lastUpdate: new Date().toISOString(),
    };

    // Update secondary vehicle D-108 state if present
    if (d108) {
      d108.telemetry = {
        ...d108.telemetry,
        nearestVehicleDistanceMeters: distanceM,
        relativeSpeedKmh: -closingSpeedKmh,
        lastUpdate: new Date().toISOString(),
        source: 'SIMULATION',
      };
    }

    // Update P-301 if patrol vehicle is simulated
    if (p301) {
      p301.telemetry.lastUpdate = new Date().toISOString();
    }

    // Dispatch through unified core processing pipeline
    if (this.telemetryCallback) {
      this.telemetryCallback({
        type: 'SIMULATION_TICK',
        scenario: scenarioName,
        telemetry: simulatedTelemetry,
      });
    }
  }

  getStatus() {
    return {
      isPlaying: this.isPlaying,
      activeScenario: this.activeScenario,
      speedMs: this.speedMs,
      tickCount: this.tickCount,
      currentApproachDistance: this.temporal.approachDistanceSequence[this.temporal.approachIndex % this.temporal.approachDistanceSequence.length],
    };
  }
}

export const simulatorEngine = new SimulatorEngine();
