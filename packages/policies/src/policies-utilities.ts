import { Policy } from "./types";

/**
 * These two functions perform opposite operations.
 * Policy name is transform to  node flavor once the whitespaces have bee replace with '-'.
 */

export function parsePolicyName(policyName: string): string {
    return policyName.toLowerCase().replace(/\s/g, '-');
}

export function parseNodeFlavor(flavorValue: string): string {
    return flavorValue.replace("-", " ");
}

/**
 * Returns the fist 'policy.byParam 'that matches 'value'.
 * The match criteria is not case sensitive.
 */
export function findPolicy(policies: Policy[], byParam: string, value: string): Policy | undefined {
    let expression;
    if (byParam === 'name') {
        const parsedFlavorValue = parseNodeFlavor(value);
        expression = new RegExp(parsedFlavorValue, "i");
    } else {
        expression = new RegExp(value, "i");
    }
    return policies.find(policy => !!policy[byParam].match(expression));
}
