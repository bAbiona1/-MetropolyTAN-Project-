import {
    getLocations,
    getLocationById,
    createLocation,
    updateLocation,
    deleteLocation
} from "../services/location.service";
import {
    getModes,
    getModeById,
    createMode,
    updateMode,
    deleteMode
} from "../services/mode.service";
import {
    getLines,
    getLineById,
    createLine,
    updateLine,
    deleteLine
} from "../services/line.service";
import {
    getStops,
    getStopById,
    createStop,
    updateStop,
    deleteStop
} from "../services/stop.service";

// import authenticate from "@/store/authenticate";

export default {
    namespaced: true,
    state: {
        locations: [],
        currentLocation: null,
        modes: [],
        currentMode: null,
        lines: [],
        currentLine: null,
        stops: [],
        currentStop: null
    },
    mutations: {
        setLocations(state, locations) {
            state.locations = locations;
        },
        setCurrentLocation(state, location) {
            state.currentLocation = location;
        },
        updateLocation(state, location) {
            const idx = state.locations.findIndex((l) => l.id === location.id);
            if (idx !== -1) {
                state.locations.splice(idx, 1, location);
            }
        },
        createLocation(state, location) {
            state.locations.push(location);
        },
        deleteLocation(state, id) {
            const idx = state.locations.findIndex((l) => l.id === id);
            if (idx !== -1) {
                state.locations.splice(idx, 1);
            }
        },
        setModes(state, modes) {
            state.modes = modes;
        },
        setCurrentMode(state, mode) {
            state.currentMode = mode;
        },
        updateMode(state, mode) {
            const idx = state.modes.findIndex((m) => m.id === mode.id);
            if (idx !== -1) {
                state.modes.splice(idx, 1, mode);
            }
        },
        createMode(state, mode) {
            state.modes.push(mode);
        },
        deleteMode(state, id) {
            const idx = state.modes.findIndex((m) => m.id === id);
            if (idx !== -1) {
                state.modes.splice(idx, 1);
            }
        },
        setLines(state, lines) {
            state.lines = lines;
        },
        setCurrentLine(state, line) {
            state.currentLine = line;
        },
        updateLine(state, line) {
            const idx = state.lines.findIndex((l) => l.id === line.id);
            if (idx !== -1) {
                state.lines.splice(idx, 1, line);
            }
        },
        createLine(state, line) {
            state.lines.push(line);
        },
        deleteLine(state, id) {
            const idx = state.lines.findIndex((l) => l.id === id);
            if (idx !== -1) {
                state.lines.splice(idx, 1);
            }
        },
        setStops(state, stops) {
            state.stops = stops;
        },
        setCurrentStop(state, stop) {
            state.currentStop = stop;
        },
        updateStop(state, stop) {
            const idx = state.stops.findIndex((s) => s.id === stop.id);
            if (idx !== -1) {
                state.stops.splice(idx, 1, stop);
            }
        },
        createStop(state, stop) {
            state.stops.push(stop);
        },
        deleteStop(state, id) {
            const idx = state.stops.findIndex((s) => s.id === id);
            if (idx !== -1) {
                state.stops.splice(idx, 1);
            }
        }
    },
    actions: {
        async getLocationsFromAPI({ commit }) {
            const result = await getLocations();
            commit("setLocations", result.data);
        },
        async getCurrentLocationFromAPI({ commit }, id) {
            const result = await getLocationById(id);
            commit("setCurrentLocation", result.data);
        },
        async updateCurrentLocationToAPI({ commit }, location) {
            const result = await updateLocation(location);
            commit("updateLocation", result.data);
        },
        async createLocationFromAPI({ commit }, location) {
            const result = await createLocation(location);
            commit("createLocation", result.data);
        },
        async deleteLocationFromAPI({ commit }, id) {
            await deleteLocation(id);
            commit("deleteLocation", id);
        },
        async getModesFromAPI({ commit }) {
            const result = await getModes();
            commit("setModes", result.data);
        },
        async getCurrentModeFromAPI({ commit }, id) {
            const result = await getModeById(id);
            commit("setCurrentMode", result.data);
        },
        async updateCurrentModeToAPI({ commit }, mode) {
            const result = await updateMode(mode);
            commit("updateMode", result.data);
        },
        async createModeFromAPI({ commit }, mode) {
            const result = await createMode(mode);
            commit("createMode", result.data);
        },
        async deleteModeFromAPI({ commit }, id) {
            await deleteMode(id);
            commit("deleteMode", id);
        },
        async getLinesFromAPI({ commit }) {
            const result = await getLines();
            commit("setLines", result.data);
        },
        async getCurrentLineFromAPI({ commit }, id) {
            console.log(id)
            const result = await getLineById(id);
            console.log(result)
            commit("setCurrentLine", result.data);
        },
        async updateCurrentLineToAPI({ commit }, line) {
            const result = await updateLine(line);
            commit("updateLine", result.data);
        },
        async createLineFromAPI({ commit }, line) {
            const result = await createLine(line);
            commit("createLine", result.data);
        },
        async deleteLineFromAPI({ commit }, id) {
            await deleteLine(id);
            commit("deleteLine", id);
        },
        async getStopsFromAPI({ commit }) {
            const result = await getStops();
            commit("setStops", result.data);
        },
        async getCurrentStopFromAPI({ commit }, id) {
            const result = await getStopById(id);
            commit("setCurrentStop", result.data);
        },
        async updateCurrentStopToAPI({ commit }, stop) {
            const result = await updateStop(stop);
            commit("updateStop", result.data);
        },
        async createStopFromAPI({ commit }, stop) {
            const result = await createStop(stop);
            commit("createStop", result.data);
        },
        async deleteStopFromAPI({ commit }, id) {
            await deleteStop(id);
            commit("deleteStop", id);
        }
    },
}