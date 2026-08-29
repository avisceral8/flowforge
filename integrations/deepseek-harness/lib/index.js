import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

export const name = 'flowforge-dsh';
export const PACKAGE_NAME = '@tt-a1i/archify-dsh';

export function resolveFlowForgeSkillRoot(profileBaseUrl) {
  if (!profileBaseUrl) {
    throw new Error('flowforge-dsh: missing DSH profile baseUrl for package resolution');
  }
  let manifestPath;
  try {
    manifestPath = createRequire(profileBaseUrl).resolve(`${PACKAGE_NAME}/package.json`);
  } catch (error) {
    throw new Error(
      `flowforge-dsh: cannot resolve ${PACKAGE_NAME}/package.json from the DSH profile`,
      { cause: error },
    );
  }
  return join(dirname(manifestPath), 'skills');
}
