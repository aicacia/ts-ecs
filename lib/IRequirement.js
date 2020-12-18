"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requirementToString = exports.filterRequirements = void 0;
function filterRequirements(requirements, filter) {
    return requirements.reduce(function (missing, requirement) {
        if (Array.isArray(requirement)) {
            if (!requirement.some(filter)) {
                missing.push(requirement);
            }
        }
        else {
            if (filter(requirement)) {
                missing.push(requirement);
            }
        }
        return missing;
    }, []);
}
exports.filterRequirements = filterRequirements;
function requirementToString(requirement) {
    if (Array.isArray(requirement)) {
        return "one of " + requirement.map(requirementToString).join(", ");
    }
    else {
        return requirement.name || requirement.typeId || "UnknownClass";
    }
}
exports.requirementToString = requirementToString;
