import { IConstructor } from "@aicacia/core";

export type IRequirement<T> = IConstructor<T> | Array<IConstructor<T>>;

export function filterRequirements<T>(
  requirements: IRequirement<T>[],
  filter: (value: IConstructor<T>) => boolean
): IRequirement<T>[] {
  return requirements.reduce((missing, requirement) => {
    if (Array.isArray(requirement)) {
      if (!requirement.some(filter)) {
        missing.push(requirement);
      }
    } else {
      if (filter(requirement)) {
        missing.push(requirement);
      }
    }
    return missing;
  }, [] as IRequirement<T>[]);
}

export function requirementToString<T>(requirement: IRequirement<T>): string {
  if (Array.isArray(requirement)) {
    return `one of ${requirement.map(requirementToString).join(", ")}`;
  } else {
    return requirement.name || (requirement as any).typeId || "UnknownClass";
  }
}
