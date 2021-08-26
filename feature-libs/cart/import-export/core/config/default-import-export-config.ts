import { ImportExportConfig } from './import-export-config';

// TODO: Avoid using duplicated config #11931
export const defaultImportExportConfig: ImportExportConfig = {
  cartImportExport: {
    file: {
      separator: ',',
    },
    export: {
      additionalColumns: [
        {
          name: {
            key: 'name',
          },
          value: 'product.name',
        },
        {
          name: {
            key: 'price',
          },
          value: 'totalPrice.formattedValue',
        },
      ],
    },
  },
};