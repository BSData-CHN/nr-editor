import type { BSICatalogue, BSICatalogueLink, BSIData, BSIGameSystem } from "./bs_types";
import type { Catalogue } from "./bs_main_catalogue";
import { getBookDate, BooksDate } from "./bs_versioning";
import { loadData } from "./bs_load_data";
import { arrayKeys, Base, getDataObject } from "./bs_main";
// @ts-ignore - 模块路径问题
import { GameSystem } from "~/assets/ts/systems/game_system";
import { forEachPairRecursive, removePrefix } from "./bs_helpers";
import { translate, untranslate } from "./bs_translation";

export class BSCatalogueManager {
  catalogues = {} as Record<string, Record<string, Catalogue>>;
  unresolvedLinks?: Record<string, Array<Base>>;
  settings?: Record<string, string | number | boolean | undefined>;
  system?: GameSystem;
  private translations?: Record<string, any>;
  // Must implement
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getData(catalogueLink: BSICatalogueLink, booksDate?: BooksDate): Promise<BSIData> {
    throw new Error("Method not implemented.");
  }
  async loadAll() {
    throw new Error("Method not implemented.");
  }
  async translate(json: Record<string, any>) {
    if (this.translations) {
      translate(json, this.translations)
    }
  }
  async untranslate(json: Record<string, any>) {
    untranslate(json)
  }
  async setTranslations(translations?: Record<string, any> | null) {
    const prevTranslations = this.translations;
    this.translations = translations ?? undefined;
    for (const catalogue of this.getAllLoadedCatalogues()) {
      if (prevTranslations) {
        await this.untranslate(catalogue);
      }
      if (translations) {
        await this.translate(catalogue);
      }
    }
  }
  getTranslations() {
    return this.translations;
  }

  getCatalogueInfo(catalogueLink: BSICatalogueLink): BSICatalogue | BSIGameSystem | undefined {
    // @ts-ignore - 隐式 any 类型
    return this.system?.books.array?.find((o: any) => o.bsid === catalogueLink.targetId) as
      | BSICatalogue
      | BSIGameSystem
      | undefined;
  }
  findOptionById(id: string): Base | undefined {
    return undefined;
  }
  getLoadedCatalogue(catalogueLink: BSICatalogueLink | string, booksDate?: BooksDate): Catalogue | undefined {
    const key = typeof catalogueLink === "string" ? catalogueLink : catalogueLink.targetId || catalogueLink.name!;
    const date = getBookDate(booksDate, key) || "default";

    const dateIndex = this.catalogues[key];
    return dateIndex ? dateIndex[date] : undefined;
  }
  getAllLoadedCatalogues() {
    return Object.values(this.catalogues)
      .map((o) => Object.values(o))
      .flat(1);
  }
  addLoadedCatalogue(catalogue: Catalogue, booksDate?: BooksDate): void {
    const date = getBookDate(booksDate, catalogue.id) || "default";
    if (!this.catalogues[catalogue.name]) this.catalogues[catalogue.name] = {};
    if (!this.catalogues[catalogue.id]) this.catalogues[catalogue.id] = {};
    this.catalogues[catalogue.name][date] = catalogue;
    this.catalogues[catalogue.id][date] = catalogue;
  }
  addLoadedSystem(system: Catalogue, booksDate?: BooksDate) {
    return this.addLoadedCatalogue(system, booksDate);
  }
  unloadAll() {
    this.catalogues = {};
  }

  async loadData(data: BSIData, booksDate?: BooksDate): Promise<Catalogue> {
    const loaded = await loadData(this, data, booksDate);
    loaded.process();
    return loaded;
  }
  async loadCatalogue(catalogueLink: BSICatalogueLink, booksDate?: BooksDate, forceLoad?: boolean): Promise<Catalogue> {
    const loaded = this.getLoadedCatalogue(catalogueLink, booksDate);
    if (loaded && !forceLoad) return loaded;
    const data = await this.getData(catalogueLink, booksDate);
    if (data) {
      const result = await this.loadData(data, booksDate);
      return result;
    }
    throw Error(`Couldn't load catalogue: couldn't getData ${catalogueLink}`);
  }
}
