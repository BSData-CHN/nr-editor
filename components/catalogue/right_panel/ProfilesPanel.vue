<template>
  <CatalogueRightPanelFieldsComment :item="item" class="section" />
  <CatalogueRightPanelFieldsBasics :item="item" class="section" aliases />
  <CatalogueRightPanelFieldsReference :item="item" :catalogue="catalogue" class="section" />
  <CatalogueRightPanelFieldsHidden :item="item" class="section">
    Constraints
  </CatalogueRightPanelFieldsHidden>

  <CatalogueRightPanelFieldsCharacteristics class="section" :item="item" :catalogue="catalogue" />
  <CatalogueRightPanelFieldsAttributes class="section" :item="item" :catalogue="catalogue" />
</template>

<script lang="ts">
import type { PropType } from "vue";
import type { Catalogue } from "~/assets/shared/battlescribe/bs_main_catalogue";
import type { BSIProfile } from "~/assets/shared/battlescribe/bs_types";

export default {
  props: {
    catalogue: {
      type: Object as PropType<Catalogue>,
      required: true,
    },
    item: {
      type: Object as PropType<BSIProfile>,
      required: true,
    },
  },
};
</script>
