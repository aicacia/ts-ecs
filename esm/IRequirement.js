export function filterRequirements(requirements, filter) {
    return requirements.reduce((missing, requirement) => {
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
export function requirementToString(requirement) {
    if (Array.isArray(requirement)) {
        return `one of ${requirement.map(requirementToString).join(", ")}`;
    }
    else {
        return requirement.name || requirement.typeId || "UnknownClass";
    }
}
