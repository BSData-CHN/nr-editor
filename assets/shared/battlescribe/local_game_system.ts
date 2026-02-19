import { BSCatalogueManager } from "./bs_system";
import { BSIDataSystem, BSIDataCatalogue, BSICatalogueLink, BSIData, BSICatalogue, BSIGameSystem } from "./bs_types";
import { BooksDate } from "./bs_versioning";
import { Catalogue } from "./bs_main_catalogue";
import { loadData } from "./bs_load_data";
import type { GithubIntegration } from "./github";
import { db } from "./cataloguesdexie";
import { Base } from "./bs_main";
import { noObserve } from "./bs_main_types";
import { db as cataloguesdb } from "~/assets/shared/battlescribe/cataloguesdexie";

export class GameSystemFiles extends BSCatalogueManager {
  gameSystem: BSIDataSystem | null = null;
  catalogueFiles: Record<string, BSIDataCatalogue> = noObserve() as {};
  allLoaded?: boolean;
  loadedCatalogues: Record<string, Catalogue> = {};
  github?: GithubIntegration;
  unresolvedLinks: Record<string, Array<Base>> = {};
  index: Record<string, Base> = {};
  handle?: FileSystemDirectoryHandle;
  update?: (file: BSIData) => void | Promise<void>
  load?: (file: BSIData) => void | Promise<void>
  async loadData(data: BSIData, booksDate?: BooksDate): Promise<Catalogue> {
    await this.load?.(data);
    const loaded = await loadData(this, data, booksDate, { deleteBadLinks: false });
    return loaded;
  }
  findOptionById(id: string): Base | undefined {
    for (const catalogue of Object.values(this.loadedCatalogues)) {
      if (catalogue.index && catalogue.index[id]) return catalogue.index[id];
    }
  }
  unloadAll() {
    super.unloadAll();
    for (const obj of Object.values(this.loadedCatalogues)) {
      obj.reset();
    }
    this.loadedCatalogues = {};
    this.index = {}
    delete this.allLoaded;
  }
  async loadAll(progress_cb?: (current: number, max: number, msg?: string) => void | Promise<void>) {
    let max = Object.values(this.catalogueFiles).length + 1;
    let current = 0;
    if (!this.allLoaded) {
      console.log("Loading all catalogues in", this.gameSystem?.gameSystem?.name);
    }
    if (this.gameSystem) {
      progress_cb && (await progress_cb(current, max, `Loading ${this.gameSystem.gameSystem.name}`));
      // @ts-ignore - CatalogueLink 类型兼容性问题
      const loadedSys = await this.loadCatalogue({ targetId: this.gameSystem.gameSystem.id });

      loadedSys.processForEditor();
      current++;

      for (const catalogue of Object.values(this.catalogueFiles)) {
        progress_cb && (await progress_cb(current, max, `Loading ${catalogue.catalogue.name}`));
        // @ts-ignore - CatalogueLink 类型兼容性问题
        const loaded = await this.loadCatalogue({ targetId: catalogue.catalogue.id });
        loaded.processForEditor();
        current++;
        progress_cb && (await progress_cb(current, max, `Loading ${catalogue.catalogue.name}`));
      }
    }
    this.allLoaded = true;
  }
  getLoadedCatalogue(catalogueLink: BSICatalogueLink, booksDate?: BooksDate): Catalogue | undefined {
    const key = catalogueLink.targetId || catalogueLink.name!;
    return this.loadedCatalogues[key] as Catalogue | undefined;
  }
  addLoadedCatalogue(catalogue: Catalogue, booksDate?: BooksDate): void {
    this.loadedCatalogues[catalogue.id] = catalogue;
  }
  getAllLoadedCatalogues() {
    return Object.values(this.loadedCatalogues);
  }
  getId() {
    return this.gameSystem?.gameSystem.id;
  }
  getCatalogueInfo(catalogueLink: BSICatalogueLink) {
    if (this.gameSystem?.gameSystem.id === catalogueLink.targetId) {
      return this.gameSystem?.gameSystem;
    }
    for (const catalogue of Object.values(this.catalogueFiles)) {
      if (catalogue.catalogue.id === catalogueLink.targetId) {
        return catalogue.catalogue;
      }
    }
  }

  getAllCatalogueFiles() {
    return [...(this.gameSystem ? [this.gameSystem] : []), ...Object.values(this.catalogueFiles)];
  }
  setSystem(system: BSIDataSystem, skipSave?: boolean) {
    this.gameSystem = system;
    if (!skipSave) {
      const promise = cataloguesdb.systems.put({ id: system.gameSystem.id, content: system, handle: this.handle })
      this.update && this.update(system)
      return promise
    } else {
      this.update && this.update(system)
    }
  }
  setCatalogue(catalogue: BSIDataCatalogue, skipSave?: boolean) {
    const catalogueId = catalogue.catalogue.id;
    this.catalogueFiles[catalogueId] = catalogue;
    if (!skipSave) {
      const promise = cataloguesdb.catalogues.put({ id: catalogueId, content: catalogue })
      this.update && this.update(catalogue)
      return promise
    } else {
      this.update && this.update(catalogue)
    }
  }
  removeCatalogue(catalogue: BSIDataCatalogue) {
    for (const [key, value] of Object.entries(this.catalogueFiles)) {
      if (value.catalogue.id === catalogue.catalogue.id) {
        delete this.catalogueFiles[key];
      }
    }
  }

  async getData(catalogueLink: BSICatalogueLink, booksDate?: BooksDate): Promise<BSIData> {
    if (catalogueLink.targetId == this.gameSystem?.gameSystem.id) {
      return this.gameSystem;
    }
    if (catalogueLink.targetId in this.catalogueFiles) {
      return this.catalogueFiles[catalogueLink.targetId];
    }

    const catalogue = await db.catalogues.get({
      "content.catalogue.id": catalogueLink.targetId,
    });
    if (catalogue) {
      return catalogue.content;
    }

    const system = await db.systems.get(catalogueLink.targetId);
    if (system) {
      return system.content;
    }

    const errorPart = catalogueLink.name ? `name ${catalogueLink.name}` : `id ${catalogueLink.targetId}`;
    throw Error(`Couldn't import catalogue with ${errorPart}, perhaps it wasnt uploaded?`);
  }
}
