import noRawInteractiveElements from './no-raw-interactive-elements.mjs';
import noHardcodedColor from './no-hardcoded-color.mjs';
import requireEslintDisableJustification from './require-eslint-disable-justification.mjs';
import noConflictingAccessibleName from './no-conflicting-accessible-name.mjs';
import noPlaceholderAsLabel from './no-placeholder-as-label.mjs';

const plugin = {
  meta: {
    name: 'eslint-plugin-roqn',
  },
  rules: {
    'no-raw-interactive-elements': noRawInteractiveElements,
    'no-hardcoded-color': noHardcodedColor,
    'require-eslint-disable-justification': requireEslintDisableJustification,
    'no-conflicting-accessible-name': noConflictingAccessibleName,
    'no-placeholder-as-label': noPlaceholderAsLabel,
  },
};

export default plugin;
