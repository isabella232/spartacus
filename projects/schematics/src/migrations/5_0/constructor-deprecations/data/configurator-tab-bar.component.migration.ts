import {
  CONFIGURATOR_COMMONS_SERVICE,
  CONFIGURATOR_ROUTER_EXTRACTOR_SERVICE,
  CONFIGURATOR_TAB_BAR_COMPONENT,
  SPARTACUS_PRODUCT_CONFIGURATOR_COMMON,
  SPARTACUS_PRODUCT_CONFIGURATOR_RULEBASED,
} from '../../../../shared/constants';
import { ConstructorDeprecation } from '../../../../shared/utils/file-utils';

export const CONFIGURATOR_TAB_BAR_COMPONENT_MIGRATION: ConstructorDeprecation =
  {
    // feature-libs/product-configurator/rulebased/components/tab-bar/configurator-tab-bar.component.ts
    class: CONFIGURATOR_TAB_BAR_COMPONENT,
    importPath: SPARTACUS_PRODUCT_CONFIGURATOR_RULEBASED,
    deprecatedParams: [
      {
        className: CONFIGURATOR_ROUTER_EXTRACTOR_SERVICE,
        importPath: SPARTACUS_PRODUCT_CONFIGURATOR_COMMON,
      },
    ],
    addParams: [
      {
        className: CONFIGURATOR_COMMONS_SERVICE,
        importPath: SPARTACUS_PRODUCT_CONFIGURATOR_RULEBASED,
      },
    ],
  };
