// bs_types.ts - BSI 类型定义
// 这些类型是从 bs_main.ts 和 bs_main_catalogue.ts 中的类导出的

import type {
  Catalogue,
  CatalogueLink,
  GameSystem,
  Publication,
} from "./bs_main_catalogue";

import type {
  Base,
  Entry,
  Group,
  Link,
  InfoLink,
  CategoryLink,
  Category,
  ForceEntryLink,
  Force,
  ProfileType,
  Profile,
  Characteristic,
  Condition,
  Constraint,
  Modifier,
  ModifierGroup,
  LocalConditionGroup,
  Rule,
  InfoGroup,
  ConditionGroup,
} from "./bs_main";

// ==================== 基础类型 ====================
export type BSIBase = Base;
export type BSINamed = { name: string };
export type BSIDescription = { description: string };
export type BSIHidden = { hidden: boolean };

// ==================== Catalogue 相关类型 ====================
export type BSICatalogue = Catalogue;
export type BSICatalogueLink = CatalogueLink;
export type BSIGameSystem = GameSystem;
export type BSIPublication = Publication;
export type BSIReference = Link;

// ==================== Entry 相关类型 ====================
export type BSIEntry = Entry;
export type BSISelectionEntry = Entry;
export type BSISelectionEntryGroup = Group;
export type BSIEntryLink = Link<Entry>;
export type BSIGroup = Group;
export type BSICategory = Category;
export type BSICategoryLink = CategoryLink;
export type BSIForce = Force;
export type BSIForceEntryLink = ForceEntryLink;

// ==================== Profile 相关类型 ====================
export type BSIProfile = Profile;
export type BSIProfileType = ProfileType;
export type BSICharacteristic = Characteristic;

// BSICharacteristicType 和 BSIAttributeType 是内联类型定义
// 在 bs_main.ts 中 ProfileType 类中使用
export type BSICharacteristicType = {
  id: string;
  name: string;
  [key: string]: any;
};

export type BSIAttributeType = {
  id: string;
  name: string;
  [key: string]: any;
};

export type BSIAttribute = {
  id: string;
  name: string;
  type?: BSIAttributeType;
  typeId?: string;
  [key: string]: any;
};

// ==================== Condition/Modifier 相关类型 ====================
export type BSICondition = Condition;
export type BSIConstraint = Constraint;
export type BSIModifier = Modifier;
export type BSIModifierGroup = ModifierGroup;
export type BSIConditionGroup = ConditionGroup;
export type BSILocalConditionGroup = LocalConditionGroup;
export type BSIRule = Rule;
export type BSIInfoGroup = InfoGroup;

// ==================== 特殊类型 ====================
export type BSICost = {
  id: string;
  name: string;
  typeId: string;
  value?: number;
};

export type BSICostType = {
  id: string;
  name?: string;
  defaultCostLimit?: number;
  [key: string]: any;
};

export type BSIQuery = {
  type: string;
  [key: string]: any;
};

export type SupportedQueries = {
  [key: string]: any;
};

export type BSIRepeat = {
  field: string;
  scope: string;
  value?: number;
  repeats?: number;
  roundUp?: boolean;
  includeChildSelections?: boolean;
  includeChildForces?: boolean;
  childId?: string;
  shared?: boolean;
};

export type BSIConditional = {
  conditions?: BSICondition[];
  conditionGroups?: BSIConditionGroup[];
};

// ==================== NR 扩展类型 ====================
export type NRAssociation = {
  id: string;
  name: string;
  [key: string]: any;
};

export type AssociationConstraint = BSIConstraint & {
  associationId?: string;
  [key: string]: any;
};

export type BSIModifierType = "set" | "add" | "subtract" | "multiply" | "divide" | "append" | "prepend" | "remove" | string;

// ==================== Data 类型 (用于 Dexie 数据库) ====================
export type BSIData = {
  gameSystem?: BSIDataSystem;
  catalogue?: BSIDataCatalogue;
  catalogues?: BSIDataCatalogue[];
  systems?: BSIDataSystem[];
};

export type BSIDataCatalogue = {
  id: string;
  name: string;
  gameSystemId: string;
  source?: string;
  content?: string;
  lastUpdated?: string;
  [key: string]: any;
};

export type BSIDataSystem = {
  id: string;
  name: string;
  catalogues?: BSIDataCatalogue[];
  [key: string]: any;
};

// ==================== InfoLink 类型 ====================
// InfoLink 的泛型约束是 Rule | InfoGroup | Profile
export type BSIInfoLink = InfoLink<Rule | InfoGroup | Profile>;

// ==================== BSILink 类型 ====================
export type BSILink<T extends Base = Group | Entry> = Link<T>;

// ==================== EditorBase 类型 ====================
export type EditorBase = {
  parent?: EditorBase;
  refs?: EditorBase[];
  other_refs?: EditorBase[];
  catalogue: BSICatalogue;
  parentKey: string;
  editorTypeName: string;
  showInEditor?: boolean;
  showChildsInEditor?: boolean;
  highlightInEditor?: boolean;
  errors?: any[];
};

// ==================== XML 解析相关类型 ====================
/**
 * 用于 fast-xml-parser 解析后的原始 XML 数据结构
 */
export type XMLParsed = {
  catalogue?: XMLCatalogue;
  gameSystem?: XMLGameSystem;
  [key: string]: any;
};

export type XMLCatalogue = {
  xmlns?: string;
  library?: boolean;
  id: string;
  name: string;
  gameSystemId: string;
  gameSystemRevision?: number;
  revision?: number;
  authorName?: string;
  battleScribeVersion?: string;
  type: "catalogue";
  authorContact?: string;
  authorUrl?: string;
  hidden?: boolean;
  
  costTypes?: XMLCostType | XMLCostType[];
  profileTypes?: XMLProfileType | XMLProfileType[];
  categoryEntries?: XMLCategory | XMLCategory[];
  forceEntries?: XMLForce | XMLForce[];
  sharedSelectionEntries?: XMLSelectionEntry | XMLSelectionEntry[];
  sharedSelectionEntryGroups?: XMLSelectionEntryGroup | XMLSelectionEntryGroup[];
  sharedProfiles?: XMLProfile | XMLProfile[];
  sharedRules?: XMLRule | XMLRule[];
  sharedInfoGroups?: XMLInfoGroup | XMLInfoGroup[];
  sharedForceEntries?: XMLForce | XMLForce[];
  selectionEntries?: XMLSelectionEntry | XMLSelectionEntry[];
  selectionEntryGroups?: XMLSelectionEntryGroup | XMLSelectionEntryGroup[];
  entryLinks?: XMLEntryLink | XMLEntryLink[];
  infoLinks?: XMLInfoLink | XMLInfoLink[];
  infoGroups?: XMLInfoGroup | XMLInfoGroup[];
  rules?: XMLRule | XMLRule[];
  publications?: XMLPublication | XMLPublication[];
  catalogueLinks?: XMLCatalogueLink | XMLCatalogueLink[];
  
  [key: string]: any;
};

export type XMLGameSystem = {
  xmlns?: string;
  id: string;
  name: string;
  battleScribeVersion?: string;
  revision?: number;
  type: "gameSystem";
  authorName?: string;
  authorContact?: string;
  authorUrl?: string;
  
  costTypes?: XMLCostType | XMLCostType[];
  profileTypes?: XMLProfileType | XMLProfileType[];
  categoryEntries?: XMLCategory | XMLCategory[];
  forceEntries?: XMLForce | XMLForce[];
  sharedSelectionEntries?: XMLSelectionEntry | XMLSelectionEntry[];
  sharedSelectionEntryGroups?: XMLSelectionEntryGroup | XMLSelectionEntryGroup[];
  sharedProfiles?: XMLProfile | XMLProfile[];
  sharedRules?: XMLRule | XMLRule[];
  sharedInfoGroups?: XMLInfoGroup | XMLInfoGroup[];
  sharedForceEntries?: XMLForce | XMLForce[];
  publications?: XMLPublication | XMLPublication[];
  
  [key: string]: any;
};

export type XMLPublication = {
  id: string;
  name: string;
  shortName?: string;
  publisher?: string;
  publicationDate?: string | number;
  publisherUrl?: string;
  [key: string]: any;
};

export type XMLCostType = {
  id: string;
  name: string;
  defaultCostLimit?: number;
  modifiers?: XMLModifier | XMLModifier[];
  modifierGroups?: XMLModifierGroup | XMLModifierGroup[];
  [key: string]: any;
};

export type XMLProfileType = {
  id: string;
  name: string;
  sortIndex?: number;
  characteristicTypes?: XMLCharacteristicType | XMLCharacteristicType[];
  attributeTypes?: XMLAttributeType | XMLAttributeType[];
  [key: string]: any;
};

export type XMLCharacteristicType = {
  id: string;
  name: string;
  [key: string]: any;
};

export type XMLAttributeType = {
  id: string;
  name: string;
  [key: string]: any;
};

export type XMLCategory = {
  id: string;
  name: string;
  hidden?: boolean;
  description?: string;
  rules?: XMLRule | XMLRule[];
  profiles?: XMLProfile | XMLProfile[];
  infoGroups?: XMLInfoGroup | XMLInfoGroup[];
  infoLinks?: XMLInfoLink | XMLInfoLink[];
  constraints?: XMLConstraint | XMLConstraint[];
  modifiers?: XMLModifier | XMLModifier[];
  modifierGroups?: XMLModifierGroup | XMLModifierGroup[];
  [key: string]: any;
};

export type XMLForce = {
  id: string;
  name: string;
  hidden?: boolean;
  readme?: string;
  childForcesLabel?: string;
  categories?: XMLCategoryLink | XMLCategoryLink[];
  forces?: XMLForce | XMLForce[];
  forceEntries?: XMLForce | XMLForce[];
  forceEntryLinks?: XMLForceEntryLink | XMLForceEntryLink[];
  profiles?: XMLProfile | XMLProfile[];
  rules?: XMLRule | XMLRule[];
  infoGroups?: XMLInfoGroup | XMLInfoGroup[];
  infoLinks?: XMLInfoLink | XMLInfoLink[];
  constraints?: XMLConstraint | XMLConstraint[];
  modifiers?: XMLModifier | XMLModifier[];
  modifierGroups?: XMLModifierGroup | XMLModifierGroup[];
  costs?: XMLCost | XMLCost[];
  [key: string]: any;
};

export type XMLForceEntryLink = {
  id: string;
  targetId: string;
  type: "force";
  hidden?: boolean;
  import?: boolean;
  categories?: XMLCategoryLink | XMLCategoryLink[];
  forces?: XMLForce | XMLForce[];
  [key: string]: any;
};

export type XMLCategoryLink = {
  id: string;
  targetId: string;
  primary?: boolean;
  hidden?: boolean;
  [key: string]: any;
};

export type XMLSelectionEntry = {
  id: string;
  name: string;
  type: "unit" | "model" | "upgrade" | "selection";
  import?: boolean;
  hidden?: boolean;
  collective?: boolean;
  flatten?: boolean;
  subType?: "mount" | "crew" | "unit-group";
  sortIndex?: number;
  
  selectionEntries?: XMLSelectionEntry | XMLSelectionEntry[];
  selectionEntryGroups?: XMLSelectionEntryGroup | XMLSelectionEntryGroup[];
  entryLinks?: XMLEntryLink | XMLEntryLink[];
  profiles?: XMLProfile | XMLProfile[];
  rules?: XMLRule | XMLRule[];
  infoGroups?: XMLInfoGroup | XMLInfoGroup[];
  infoLinks?: XMLInfoLink | XMLInfoLink[];
  associations?: XMLAssociation | XMLAssociation[];
  constraints?: XMLConstraint | XMLConstraint[];
  modifiers?: XMLModifier | XMLModifier[];
  modifierGroups?: XMLModifierGroup | XMLModifierGroup[];
  categoryLinks?: XMLCategoryLink | XMLCategoryLink[];
  costs?: XMLCost | XMLCost[];
  [key: string]: any;
};

export type XMLSelectionEntryGroup = {
  id: string;
  name: string;
  import?: boolean;
  hidden?: boolean;
  defaultSelectionEntryId?: string;
  collective?: boolean;
  sortIndex?: number;
  
  selectionEntries?: XMLSelectionEntry | XMLSelectionEntry[];
  selectionEntryGroups?: XMLSelectionEntryGroup | XMLSelectionEntryGroup[];
  entryLinks?: XMLEntryLink | XMLEntryLink[];
  profiles?: XMLProfile | XMLProfile[];
  rules?: XMLRule | XMLRule[];
  infoGroups?: XMLInfoGroup | XMLInfoGroup[];
  infoLinks?: XMLInfoLink | XMLInfoLink[];
  constraints?: XMLConstraint | XMLConstraint[];
  modifiers?: XMLModifier | XMLModifier[];
  modifierGroups?: XMLModifierGroup | XMLModifierGroup[];
  categoryLinks?: XMLCategoryLink | XMLCategoryLink[];
  costs?: XMLCost | XMLCost[];
  [key: string]: any;
};

export type XMLEntryLink = {
  id: string;
  targetId: string;
  type?: string;
  import?: boolean;
  hidden?: boolean;
  sortIndex?: number;
  
  constraints?: XMLConstraint | XMLConstraint[];
  modifiers?: XMLModifier | XMLModifier[];
  [key: string]: any;
};

export type XMLProfile = {
  id: string;
  name: string;
  typeId: string;
  typeName: string;
  hidden?: boolean;
  publicationId?: string;
  page?: string;
  
  characteristics?: XMLCharacteristic | XMLCharacteristic[];
  attributes?: XMLAttribute | XMLAttribute[];
  modifiers?: XMLModifier | XMLModifier[];
  modifierGroups?: XMLModifierGroup | XMLModifierGroup[];
  [key: string]: any;
};

export type XMLCharacteristic = {
  id: string;
  name: string;
  typeId: string;
  $text: string | number;
  [key: string]: any;
};

export type XMLAttribute = {
  id: string;
  name: string;
  typeId?: string;
  type?: string;
  [key: string]: any;
};

export type XMLRule = {
  id: string;
  name: string;
  hidden?: boolean;
  publicationId?: string;
  page?: string;
  description?: string;
  alias?: string | string[];
  
  modifiers?: XMLModifier | XMLModifier[];
  modifierGroups?: XMLModifierGroup | XMLModifierGroup[];
  [key: string]: any;
};

export type XMLInfoGroup = {
  id: string;
  name: string;
  typeId?: string;
  typeName?: string;
  hidden?: boolean;
  publicationId?: string;
  page?: string;
  
  profiles?: XMLProfile | XMLProfile[];
  rules?: XMLRule | XMLRule[];
  infoGroups?: XMLInfoGroup | XMLInfoGroup[];
  infoLinks?: XMLInfoLink | XMLInfoLink[];
  modifiers?: XMLModifier | XMLModifier[];
  modifierGroups?: XMLModifierGroup | XMLModifierGroup[];
  [key: string]: any;
};

export type XMLInfoLink = {
  id: string;
  targetId: string;
  type: "profile" | "rule" | "infoGroup";
  hidden?: boolean;
  [key: string]: any;
};

export type XMLCost = {
  id: string;
  typeId: string;
  name: string;
  value?: number;
  [key: string]: any;
};

export type XMLConstraint = {
  type: "min" | "max" | "exactly";
  value: number;
  field: string;
  scope: string;
  id?: string;
  shared?: boolean;
  includeChildSelections?: boolean;
  includeChildForces?: boolean;
  childId?: string;
  [key: string]: any;
};

export type XMLModifier = {
  type: BSIModifierType;
  field: string;
  value: number | string | boolean;
  affects?: string;
  scope?: string;
  join?: string;
  arg?: string;
  
  conditions?: XMLCondition | XMLCondition[];
  conditionGroups?: XMLConditionGroup | XMLConditionGroup[];
  localConditionGroups?: BSILocalConditionGroup | BSILocalConditionGroup[];
  repeats?: XMLRepeat | XMLRepeat[];
  [key: string]: any;
};

export type XMLModifierGroup = {
  type: "or" | "and";
  comment?: string;
  
  modifiers?: XMLModifier | XMLModifier[];
  modifierGroups?: XMLModifierGroup | XMLModifierGroup[];
  conditions?: XMLCondition | XMLCondition[];
  conditionGroups?: XMLConditionGroup | XMLConditionGroup[];
  localConditionGroups?: BSILocalConditionGroup | BSILocalConditionGroup[];
  repeats?: XMLRepeat | XMLRepeat[];
  [key: string]: any;
};

export type XMLCondition = {
  type: string;
  field: string;
  value: string | number | boolean;
  scope?: string;
  childId?: string;
  shared?: boolean;
  includeChildSelections?: boolean;
  includeChildForces?: boolean;
  percentValue?: boolean;
  [key: string]: any;
};

export type XMLConditionGroup = {
  type: "or" | "and";
  
  conditions?: XMLCondition | XMLCondition[];
  conditionGroups?: XMLConditionGroup | XMLConditionGroup[];
  localConditionGroups?: BSILocalConditionGroup | BSILocalConditionGroup[];
  repeats?: XMLRepeat | XMLRepeat[];
  [key: string]: any;
};

export type XMLRepeat = {
  field: string;
  scope: string;
  value?: number;
  repeats?: number;
  roundUp?: boolean;
  includeChildSelections?: boolean;
  includeChildForces?: boolean;
  childId?: string;
  shared?: boolean;
  [key: string]: any;
};

export type XMLAssociation = {
  id: string;
  name: string;
  [key: string]: any;
};

export type XMLCatalogueLink = {
  id: string;
  targetId: string;
  name: string;
  importRootEntries?: boolean;
  [key: string]: any;
};

// ==================== 条件类型具体化 ====================
/**
 * Battlescribe 支持的条件类型
 */
export type BSIConditionType = 
  | "instanceOf"           // 检查是否属于某个类别
  | "atLeast"              // 检查是否至少有 N 个
  | "atMost"               // 检查是否最多有 N 个
  | "equalTo"              // 检查是否等于 N 个
  | "notEqualTo"           // 检查是否不等于 N 个
  | "hasForce"             // 检查是否有某个 force
  | "hasProfile"           // 检查是否有某个 profile
  | "hasRule"              // 检查是否有某个 rule
  | "hasCost"              // 检查是否有某个 cost
  | "isPrimaryForce"       // 检查是否是 primary force
  | "match"                // 匹配条件
  | "result"               // 结果条件
  | string;                // 允许自定义条件类型

// ==================== Modifier 类型具体化 ====================
/**
 * Battlescribe 支持的修饰符类型
 */
export type BSIModifierTypeUnion = 
  | "set"        // 设置为特定值
  | "add"        // 增加值
  | "subtract"   // 减少值
  | "multiply"   // 乘法
  | "divide"     // 除法
  | "append"     // 追加文本
  | "prepend"    // 前置文本
  | "remove"     // 移除
  | "increment"  // 增量
  | "decrement"  // 减量
  | "ceil"       // 向上取整
  | "floor"      // 向下取整
  | "replace"    // 替换
  | "toggle"     // 切换
  | string;      // 允许自定义修饰符类型

/**
 * Modifier 可以作用的字段类型
 */
export type BSIModifierField = 
  | "category"
  | "name"
  | "hidden"
  | "value"
  | "costId"
  | "defaultAmount"
  | "type"
  | "typeName"
  | string;

/**
 * Modifier 的作用范围
 */
export type BSIModifierScope = 
  | "selection"
  | "unit"
  | "model"
  | "upgrade"
  | "mount"
  | "crew"
  | "entry"
  | "roster"
  | "group"
  | "force"
  | "category"
  | "parent"
  | string;

// ==================== Constraint 类型具体化 ====================
/**
 * Constraint 的字段类型
 */
export type BSIConstraintField = 
  | "selections"
  | "models"
  | "cost"
  | "category"
  | string;

/**
 * Constraint 的作用范围
 */
export type BSIConstraintScope = 
  | "selection"
  | "unit"
  | "model"
  | "upgrade"
  | "mount"
  | "crew"
  | "entry"
  | "roster"
  | "group"
  | "force"
  | "category"
  | "parent"
  | string;

// ==================== Entry 类型具体化 ====================
/**
 * SelectionEntry 的类型
 */
export type BSIEntryType = 
  | "unit"
  | "model"
  | "upgrade"
  | "selection"
  | string;

/**
 * SelectionEntry 的子类型
 */
export type BSIEntrySubType = 
  | "mount"
  | "crew"
  | "unit-group"
  | string;

// ==================== 工具类型 ====================
/**
 * 从 XML 类型转换为运行时类型
 */
export type FromXML<T extends XMLParsed[keyof XMLParsed]> = 
  T extends XMLCatalogue ? BSICatalogue :
  T extends XMLGameSystem ? BSIGameSystem :
  T extends XMLProfileType ? BSIProfileType :
  T extends XMLProfile ? BSIProfile :
  T extends XMLRule ? BSIRule :
  T extends XMLInfoGroup ? BSIInfoGroup :
  T extends XMLCategory ? BSICategory :
  T extends XMLForce ? BSIForce :
  T extends XMLSelectionEntry ? BSIEntry :
  T extends XMLSelectionEntryGroup ? BSIGroup :
  unknown;

/**
 * 可序列化为 JSON 的类型
 */
export type Serializable<T> = {
  [K in keyof T]: T[K] extends Function ? never : T[K];
};

/**
 * 部分深拷贝类型
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U> ? Array<DeepPartial<U>> :
    T[P] extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> :
    DeepPartial<T[P]> | T[P];
};

/**
 * 深度只读类型
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends Array<infer U> ? ReadonlyArray<DeepReadonly<U>> :
    T[P] extends ReadonlyArray<infer U> ? ReadonlyArray<DeepReadonly<U>> :
    DeepReadonly<T[P]>;
};

// ==================== 编辑器相关类型 ====================
/**
 * 错误消息接口
 */
export interface IErrorMessage {
  msg: string;
  severity?: "error" | "warning" | "info" | "debug";
  source?: any;
  id?: string;
  other?: any;
  extra?: string;
}

/**
 * Wiki 链接接口
 */
export interface WikiLink extends Link {
  parent: WikiBase;
  refs?: WikiLink[];
}

/**
 * Wiki 基础接口
 */
export interface WikiBase extends Base {
  parent?: WikiBase;
  refs?: WikiLink[];
}

/**
 * 编辑器基础接口 - 用于 BattleScribe 数据编辑器
 */
export interface EditorBase extends Base {
  parent?: EditorBase;
  refs?: EditorBase[];
  other_refs?: EditorBase[];
  catalogue: Catalogue;

  parentKey: string & keyof EditorBase;
  editorTypeName: string & keyof typeof import("./entries").types;

  showInEditor?: boolean;
  showChildsInEditor?: boolean;
  highlightInEditor?: boolean;

  errors?: IErrorMessage[];
}

// ==================== 条目类型配置 ====================
/**
 * 条目类型配置接口
 */
export interface EntryTypeConfig {
  type: string;
  allowedChildrens?: string[] | string;
}

/**
 * 条目类型标签配置
 */
export interface EntryTypeLabel {
  label: string;
}

// ==================== 条件验证相关类型 ====================
/**
 * 有效的条件作用域
 */
export type ValidScope = 
  | "force"
  | "roster"
  | "self"
  | "parent"
  | "ancestor"
  | "primary-category"
  | "primary-catalogue"
  | "root-entry"
  | "unit"
  | "model"
  | "upgrade"
  | "model-or-unit";

/**
 * 有效的条件子 ID
 */
export type ValidChildId = 
  | "any"
  | "unit"
  | "model"
  | "upgrade"
  | "mount"
  | "crew";

// ==================== 路径相关类型 ====================
/**
 * 条目路径条目
 */
export interface EntryPathEntry {
  key: string;
  index: number;
  id?: string;
}

/**
 * 扩展的条目路径条目
 */
export interface EntryPathEntryExtended extends EntryPathEntry {
  type: string;
  display: string;
  label?: string;
  name?: string;
}

// ==================== 类别条目配置 ====================
/**
 * 类别条目配置接口
 */
export interface CategoryEntry {
  name: string;
  type: string;
  links?: string;
  icon: string;
}

// ==================== 查询相关类型 ====================
/**
 * 支持的查询类型
 */
export type SupportedQueryType = 
  | "conditions"
  | "conditionGroups"
  | "modifiers"
  | "modifierGroups"
  | "repeats";

/**
 * 查询接口
 */
export interface BSIQuery {
  type: string;
  [key: string]: any;
}

/**
 * 支持查询的接口
 */
export interface SupportedQueries {
  conditions?: BSICondition[];
  conditionGroups?: BSIConditionGroup[];
  modifiers?: BSIModifier[];
  modifierGroups?: BSIModifierGroup[];
  repeats?: BSIRepeat[];
  [key: string]: any;
}

// ==================== 条件类型具体化 ====================
/**
 * 条件类型枚举
 */
export type ConditionType = 
  | "instanceOf"
  | "notInstanceOf"
  | "atLeast"
  | "atMost"
  | "equalTo"
  | "notEqualTo"
  | "greaterThan"
  | "lessThan"
  | "none"
  | "hasForce"
  | "hasProfile"
  | "hasRule"
  | "hasCost"
  | "isPrimaryForce"
  | "match"
  | "result";

// ==================== Modifier 类型具体化 ====================
/**
 * Modifier 类型枚举
 */
export type ModifierType = 
  | "set"
  | "add"
  | "subtract"
  | "multiply"
  | "divide"
  | "append"
  | "prepend"
  | "remove"
  | "increment"
  | "decrement"
  | "ceil"
  | "floor"
  | "replace"
  | "toggle"
  | "setBaseValue"
  | "multiplyBaseValue"
  | "addBaseValue";

/**
 * Modifier 影响类型
 */
export type ModifierAffects = 
  | "selection"
  | "unit"
  | "model"
  | "upgrade"
  | "mount"
  | "crew"
  | "entry"
  | "group"
  | "force"
  | "category"
  | "roster";

// ==================== Constraint 类型具体化 ====================
/**
 * Constraint 类型枚举
 */
export type ConstraintType = 
  | "min"
  | "max"
  | "exactly";

/**
 * Constraint 字段类型
 */
export type ConstraintField = 
  | "selections"
  | "models"
  | "forces"
  | "cost"
  | "category"
  | string;

// ==================== Profile 相关类型 ====================
/**
 * Profile 属性接口
 */
export interface BSIAttribute {
  id: string;
  name: string;
  type?: BSIAttributeType;
  typeId?: string;
  [key: string]: any;
}

/**
 * Profile 属性类型接口
 */
export interface BSIAttributeType {
  id: string;
  name: string;
  [key: string]: any;
}

// ==================== Cost 相关类型 ====================
/**
 * Cost 接口
 */
export interface BSICost {
  id: string;
  name: string;
  typeId: string;
  value?: number;
  [key: string]: any;
}

/**
 * Cost 类型接口
 */
export interface BSICostType {
  id: string;
  name?: string;
  defaultCostLimit?: number;
  modifiers?: BSIModifier[];
  modifierGroups?: BSIModifierGroup[];
  [key: string]: any;
}

// ==================== Association 相关类型 ====================
/**
 * NR 扩展关联类型
 */
export interface NRAssociation {
  id: string;
  name: string;
  label?: string;
  labelMembers?: string;
  maxAssociationsPerMember?: number;
  ids?: string[];
  min?: number;
  max?: number;
  of?: string;
  info?: string;
  [key: string]: any;
}

/**
 * 关联约束接口
 */
export interface AssociationConstraint extends BSIConstraint {
  associationId?: string;
  [key: string]: any;
}

// ==================== 数据库相关类型 ====================
/**
 * BSData 数据库接口
 */
export interface BSIData {
  gameSystem?: BSIDataSystem;
  catalogue?: BSIDataCatalogue;
  catalogues?: BSIDataCatalogue[];
  systems?: BSIDataSystem[];
  [key: string]: any;
}

/**
 * 数据库目录接口
 */
export interface BSIDataCatalogue {
  id: string;
  name: string;
  gameSystemId: string;
  source?: string;
  content?: string;
  lastUpdated?: string;
  [key: string]: any;
}

/**
 * 数据库系统接口
 */
export interface BSIDataSystem {
  id: string;
  name: string;
  catalogues?: BSIDataCatalogue[];
  [key: string]: any;
}

// ==================== 本地条件组类型 ====================
/**
 * 本地条件组接口
 */
export interface BSILocalConditionGroup {
  type: "atLeast" | "greaterThan" | "atMost" | "lessThan" | "equalTo" | "notEqualTo";
  scope: string;
  field: string;
  childId?: string;
  includeChildSelections?: boolean;
  includeChildForces?: boolean;
  percentValue?: boolean;
  repeats: number;
  value: number;
  roundUp?: boolean;
}

// ==================== 额外约束类型 ====================
/**
 * 额外约束接口
 */
export interface BSIExtraConstraint extends BSIConstraint {
  name: string;
  parent: Base;
  modifiers: BSIModifier[];
  modifierGroups: BSIModifierGroup[];
}

// ==================== 版本相关类型 ====================
/**
 * 书籍日期接口
 */
export interface BooksDate {
  year?: number;
  month?: number;
  day?: number;
  [key: string]: any;
}

// ==================== 工具函数类型 ====================
/**
 * 可能是数组或单个值的类型
 */
export type MaybeArray<T> = T | T[];

/**
 * 可翻译接口
 */
export interface Translated<T> {
  original_name?: string;
  original_description?: string;
  original_readme?: string;
  original_typeName?: string;
  [key: string]: any;
}

// ==================== 管理器相关类型 ====================
/**
 * 目录管理器接口
 */
export interface ICatalogueManager {
  catalogues: Record<string, Record<string, Catalogue>>;
  settings?: Record<string, string | number | boolean | undefined>;
  
  getCatalogueInfo(catalogueLink: BSICatalogueLink): BSICatalogue | BSIGameSystem | undefined;
  findOptionById(id: string): Base | undefined;
  getLoadedCatalogue(catalogueLink: BSICatalogueLink | string, booksDate?: BooksDate): Catalogue | undefined;
  getAllLoadedCatalogues(): Catalogue[];
  addLoadedCatalogue(catalogue: Catalogue, booksDate?: BooksDate): void;
  unloadAll(): void;
}

// ==================== BSD Schema 精确定义类型 ====================
// 这些类型来自 https://github.com/BlueWinds/bsd-schema 的官方 schema 定义

/**
 * Condition 类型枚举（来自 shared.schema.json）
 */
export type BSDConditionType =
  | "greaterThan"
  | "lessThan"
  | "atMost"
  | "atLeast"
  | "equalTo"
  | "notEqualTo"
  | "instanceOf"
  | "notInstanceOf"
  | "hasForce"
  | "hasProfile"
  | "hasRule"
  | "hasCost"
  | "isPrimaryForce"
  | "match"
  | "result";

/**
 * Condition 作用域（来自 shared.schema.json）
 */
export type BSDConditionScope =
  | "self"
  | "parent"
  | "force"
  | "roster"
  | "ancestor"
  | "primary-catalogue"
  | "primary-category"
  | string; // 也可以是 selectionEntry id

/**
 * Condition 字段类型（来自 shared.schema.json）
 */
export type BSDConditionField =
  | "selections"
  | "forces"
  | string; // 也可以是 costType id

/**
 * Condition 接口（精确定义，来自 shared.schema.json）
 */
export interface BSDCondition {
  type: BSDConditionType;
  childId?: string; // 要计数的 entry/entryGroup/category id
  field?: BSDConditionField;
  scope?: BSDConditionScope;
  value?: string | number;
  percentValue?: boolean;
  includeChildSelections?: boolean;
  includeChildForces?: boolean;
  shared?: boolean;
  comment?: string;
  [key: string]: any;
}

/**
 * ConditionGroup 接口（精确定义，来自 shared.schema.json）
 */
export interface BSDConditionGroup {
  type: "and" | "or";
  conditions?: BSDCondition[];
  conditionGroups?: BSDConditionGroup[];
  comment?: string;
  [key: string]: any;
}

/**
 * Constraint 类型枚举（来自 shared.schema.json）
 */
export type BSDConstraintType = "min" | "max" | "exactly";

/**
 * Constraint 接口（精确定义，来自 shared.schema.json）
 */
export interface BSDConstraint {
  type: BSDConstraintType;
  field: BSDConditionField;
  scope: BSDConditionScope;
  value: number;
  id: string;
  percentValue?: boolean;
  includeChildSelections?: boolean;
  includeChildForces?: boolean;
  shared?: boolean;
  comment?: string;
  [key: string]: any;
}

/**
 * Cost 接口（精确定义，来自 shared.schema.json）
 */
export interface BSDCost {
  name: string;
  typeId: string; // 引用 costType
  value: number;
  [key: string]: any;
}

/**
 * CostType 接口（精确定义，来自 shared.schema.json）
 */
export interface BSDCostType {
  id: string;
  name: string;
  defaultCostLimit: number;
  hidden?: boolean;
  comment?: string;
  modifiers?: BSDModifier[];
  modifierGroups?: BSDModifierGroup[];
  [key: string]: any;
}

/**
 * Characteristic 接口（精确定义，来自 shared.schema.json）
 */
export interface BSDCharacteristic {
  name: string;
  typeId: string; // 引用 characteristicType
  $text?: string;
  [key: string]: any;
}

/**
 * CharacteristicType 接口（精确定义，来自 shared.schema.json）
 */
export interface BSDCharacteristicType {
  id: string;
  name: string;
  comment?: string;
  [key: string]: any;
}

/**
 * Attribute 接口（精确定义）
 */
export interface BSDAttribute {
  name: string;
  typeId?: string;
  type?: string;
  [key: string]: any;
}

/**
 * AttributeType 接口（精确定义）
 */
export interface BSDAttributeType {
  id: string;
  name: string;
  [key: string]: any;
}

/**
 * Profile 接口（精确定义，来自 shared.schema.json）
 */
export interface BSDProfile {
  id: string;
  name?: string;
  typeId: string; // 引用 profileType
  typeName?: string;
  characteristics: BSDCharacteristic[];
  attributes?: BSDAttribute[];
  hidden?: boolean;
  page?: number | string;
  publicationId?: string;
  comment?: string;
  modifiers?: BSDModifier[];
  modifierGroups?: BSDModifierGroup[];
  [key: string]: any;
}

/**
 * ProfileType 接口（精确定义，来自 shared.schema.json）
 */
export interface BSDProfileType {
  id: string;
  name: string;
  characteristicTypes: BSDCharacteristicType[];
  attributeTypes?: BSDAttributeType[];
  comment?: string;
  sortIndex?: number;
  [key: string]: any;
}

/**
 * Rule 接口（精确定义，来自 shared.schema.json）
 */
export interface BSDRule {
  id: string;
  name: string;
  description?: string;
  hidden?: boolean;
  page?: number | string;
  publicationId?: string;
  comment?: string;
  modifiers?: BSDModifier[];
  modifierGroups?: BSDModifierGroup[];
  alias?: string | string[];
  [key: string]: any;
}

/**
 * InfoGroup 接口（精确定义，来自 shared.schema.json）
 */
export interface BSDInfoGroup {
  id: string;
  name?: string;
  hidden?: boolean;
  page?: number | string;
  publicationId?: string;
  profiles?: BSDProfile[];
  rules?: BSDRule[];
  infoGroups?: BSDInfoGroup[];
  infoLinks?: BSDInfoLink[];
  modifiers?: BSDModifier[];
  modifierGroups?: BSDModifierGroup[];
  [key: string]: any;
}

/**
 * InfoLink 类型枚举（来自 shared.schema.json）
 */
export type BSDInfoLinkType = "rule" | "profile" | "infoGroup";

/**
 * InfoLink 接口（精确定义，来自 shared.schema.json）
 */
export interface BSDInfoLink {
  id: string;
  targetId: string; // 引用 rule/profile/infoGroup
  type: BSDInfoLinkType;
  name?: string;
  hidden?: boolean;
  page?: number | string;
  publicationId?: string;
  collective?: boolean;
  categoryLinks?: BSDCategoryLink[];
  constraints?: BSDConstraint[];
  modifiers?: BSDModifier[];
  modifierGroups?: BSDModifierGroup[];
  comment?: string;
  [key: string]: any;
}

/**
 * Category 接口（精确定义，来自 shared.schema.json）
 */
export interface BSDCategory {
  id: string;
  name: string;
  hidden?: boolean;
  description?: string;
  page?: number | string;
  publicationId?: string;
  comment?: string;
  rules?: BSDRule[];
  profiles?: BSDProfile[];
  infoGroups?: BSDInfoGroup[];
  infoLinks?: BSDInfoLink[];
  constraints?: BSDConstraint[];
  modifiers?: BSDModifier[];
  modifierGroups?: BSDModifierGroup[];
  [key: string]: any;
}

/**
 * CategoryLink 接口（精确定义，来自 shared.schema.json）
 */
export interface BSDCategoryLink {
  id: string;
  targetId: string; // 引用 category
  primary?: boolean;
  hidden?: boolean;
  name?: string;
  page?: number | string;
  publicationId?: string;
  comment?: string;
  constraints?: BSDConstraint[];
  modifiers?: BSDModifier[];
  modifierGroups?: BSDModifierGroup[];
  rules?: BSDRule[];
  profiles?: BSDProfile[];
  infoGroups?: BSDInfoGroup[];
  infoLinks?: BSDInfoLink[];
  [key: string]: any;
}

/**
 * ForceEntry 接口（精确定义，来自 shared.schema.json）
 */
export interface BSDForceEntry {
  id: string;
  name: string;
  hidden?: boolean;
  readme?: string;
  childForcesLabel?: string;
  comment?: string;
  categories?: BSDCategoryLink[];
  categoryLinks?: BSDCategoryLink[];
  forces?: BSDForceEntry[];
  forceEntries?: BSDForceEntry[];
  forceEntryLinks?: BSDForceEntryLink[];
  rules?: BSDRule[];
  profiles?: BSDProfile[];
  infoGroups?: BSDInfoGroup[];
  infoLinks?: BSDInfoLink[];
  constraints?: BSDConstraint[];
  modifiers?: BSDModifier[];
  modifierGroups?: BSDModifierGroup[];
  costs?: BSDCost[];
  [key: string]: any;
}

/**
 * ForceEntryLink 接口（精确定义）
 */
export interface BSDForceEntryLink {
  id: string;
  targetId: string; // 引用 forceEntry
  type: "force";
  hidden?: boolean;
  import?: boolean;
  childForcesLabel?: string;
  categories?: BSDCategoryLink[];
  forces?: BSDForceEntry[];
  comment?: string;
  [key: string]: any;
}

/**
 * SelectionEntry 类型枚举（来自 shared.schema.json）
 */
export type BSDSelectionEntryType =
  | "unit"
  | "model"
  | "upgrade"
  | "selection"
  | "upgrade"
  | "mount"
  | "crew"
  | string;

/**
 * SelectionEntry 接口（精确定义，来自 shared.schema.json）
 */
export interface BSDSelectionEntry {
  id: string;
  name: string;
  type: BSDSelectionEntryType;
  hidden?: boolean;
  collective?: boolean;
  flatten?: boolean;
  collapsible?: boolean;
  subType?: "mount" | "crew" | "unit-group";
  sortIndex?: number;
  page?: number | string;
  publicationId?: string;
  comment?: string;
  
  selectionEntries?: BSDSelectionEntry[];
  selectionEntryGroups?: BSDSelectionEntryGroup[];
  entryLinks?: BSDSelectionEntryLink[];
  profiles?: BSDProfile[];
  rules?: BSDRule[];
  infoGroups?: BSDInfoGroup[];
  infoLinks?: BSDInfoLink[];
  categoryLinks?: BSDCategoryLink[];
  costs?: BSDCost[];
  constraints?: BSDConstraint[];
  modifiers?: BSDModifier[];
  modifierGroups?: BSDModifierGroup[];
  associations?: BSDAssociation[];
  [key: string]: any;
}

/**
 * SelectionEntryGroup 接口（精确定义，来自 shared.schema.json）
 */
export interface BSDSelectionEntryGroup {
  id: string;
  name: string;
  hidden?: boolean;
  collective?: boolean;
  defaultSelectionEntryId?: string;
  sortIndex?: number;
  page?: number | string;
  publicationId?: string;
  comment?: string;
  
  selectionEntries?: BSDSelectionEntry[];
  selectionEntryGroups?: BSDSelectionEntryGroup[];
  entryLinks?: BSDSelectionEntryLink[];
  profiles?: BSDProfile[];
  rules?: BSDRule[];
  infoGroups?: BSDInfoGroup[];
  infoLinks?: BSDInfoLink[];
  categoryLinks?: BSDCategoryLink[];
  costs?: BSDCost[];
  constraints?: BSDConstraint[];
  modifiers?: BSDModifier[];
  modifierGroups?: BSDModifierGroup[];
  [key: string]: any;
}

/**
 * SelectionEntryLink 类型枚举
 */
export type BSDSelectionEntryLinkType = "selectionEntry" | "selectionEntryGroup";

/**
 * SelectionEntryLink 接口（精确定义，来自 shared.schema.json）
 */
export interface BSDSelectionEntryLink {
  id: string;
  targetId: string; // 引用 selectionEntry/selectionEntryGroup
  type: BSDSelectionEntryLinkType;
  hidden?: boolean;
  collective?: boolean;
  sortIndex?: number;
  page?: number | string;
  publicationId?: string;
  comment?: string;
  
  selectionEntries?: BSDSelectionEntry[];
  selectionEntryGroups?: BSDSelectionEntryGroup[];
  entryLinks?: BSDSelectionEntryLink[];
  profiles?: BSDProfile[];
  rules?: BSDRule[];
  infoGroups?: BSDInfoGroup[];
  infoLinks?: BSDInfoLink[];
  categoryLinks?: BSDCategoryLink[];
  costs?: BSDCost[];
  constraints?: BSDConstraint[];
  modifiers?: BSDModifier[];
  modifierGroups?: BSDModifierGroup[];
  [key: string]: any;
}

/**
 * Modifier 类型枚举（来自 shared.schema.json）
 */
export type BSDModifierType =
  | "set"
  | "add"
  | "subtract"
  | "multiply"
  | "divide"
  | "append"
  | "prepend"
  | "remove"
  | "increment"
  | "decrement"
  | "ceil"
  | "floor"
  | "replace"
  | "toggle"
  | "set-primary"
  | "unset-primary"
  | "setBaseValue"
  | "multiplyBaseValue"
  | "addBaseValue"
  | string;

/**
 * Modifier 接口（精确定义，来自 shared.schema.json）
 */
export interface BSDModifier {
  type: BSDModifierType;
  field: string; // 当前条目的字段或 cost id，或 "category"
  value: string | number | boolean;
  affects?: string;
  scope?: BSDConditionScope;
  join?: string;
  arg?: string;
  position?: string;
  comment?: string;
  
  conditions?: BSDCondition[];
  conditionGroups?: BSDConditionGroup[];
  repeats?: BSDRepeat[];
  [key: string]: any;
}

/**
 * ModifierGroup 接口（精确定义，来自 shared.schema.json）
 */
export interface BSDModifierGroup {
  type?: "or" | "and";
  comment?: string;
  
  modifiers?: BSDModifier[];
  modifierGroups?: BSDModifierGroup[];
  conditions?: BSDCondition[];
  conditionGroups?: BSDConditionGroup[];
  repeats?: BSDRepeat[];
  [key: string]: any;
}

/**
 * Repeat 接口（精确定义，来自 shared.schema.json）
 */
export interface BSDRepeat {
  field: BSDConditionField;
  scope: BSDConditionScope;
  value: number;
  repeats?: number;
  roundUp?: boolean;
  childId?: string;
  percentValue?: boolean;
  includeChildSelections?: boolean;
  includeChildForces?: boolean;
  shared?: boolean;
  comment?: string;
  [key: string]: any;
}

/**
 * Publication 接口（精确定义，来自 shared.schema.json）
 */
export interface BSDPublication {
  id: string;
  name: string;
  shortName?: string;
  publisher?: string;
  publicationDate?: string;
  publisherUrl?: string;
  comment?: string;
  [key: string]: any;
}

/**
 * Association 接口（NR 扩展）
 */
export interface BSDAssociation {
  id: string;
  name: string;
  label?: string;
  labelMembers?: string;
  maxAssociationsPerMember?: number;
  ids?: string[];
  min?: number;
  max?: number;
  of?: string;
  info?: string;
  [key: string]: any;
}

/**
 * Catalogue 接口（精确定义，来自 catalogue.schema.json）
 */
export interface BSDCatalogue {
  xmlns?: string;
  type: "catalogue";
  id: string;
  name: string;
  revision: number;
  gameSystemId: string;
  gameSystemRevision?: number;
  battleScribeVersion?: string;
  library?: boolean;
  authorName?: string;
  authorContact?: string;
  authorUrl?: string;
  hidden?: boolean;
  comment?: string;
  readme?: string;
  
  catalogueLinks?: BSDCatalogueLink[];
  costTypes?: BSDCostType[];
  profileTypes?: BSDProfileType[];
  categoryEntries?: BSDCategory[];
  forceEntries?: BSDForceEntry[];
  sharedSelectionEntries?: BSDSelectionEntry[];
  sharedSelectionEntryGroups?: BSDSelectionEntryGroup[];
  sharedProfiles?: BSDProfile[];
  sharedRules?: BSDRule[];
  sharedInfoGroups?: BSDInfoGroup[];
  sharedForceEntries?: BSDForceEntry[];
  selectionEntries?: BSDSelectionEntry[];
  selectionEntryGroups?: BSDSelectionEntryGroup[];
  entryLinks?: BSDSelectionEntryLink[];
  infoLinks?: BSDInfoLink[];
  infoGroups?: BSDInfoGroup[];
  rules?: BSDRule[];
  publications?: BSDPublication[];
  [key: string]: any;
}

/**
 * CatalogueLink 接口（精确定义，来自 catalogue.schema.json）
 */
export interface BSDCatalogueLink {
  id: string;
  name: string;
  targetId: string; // 引用 catalogue
  type: "catalogue";
  importRootEntries?: boolean;
  comment?: string;
  [key: string]: any;
}

/**
 * GameSystem 接口（精确定义，来自 gameSystem.schema.json）
 */
export interface BSDGameSystem {
  xmlns?: string;
  type: "gameSystem";
  id: string;
  name: string;
  revision: number;
  battleScribeVersion?: string;
  authorName?: string;
  authorContact?: string;
  authorUrl?: string;
  comment?: string;
  readme?: string;
  
  costTypes?: BSDCostType[];
  profileTypes?: BSDProfileType[];
  categoryEntries?: BSDCategory[];
  forceEntries?: BSDForceEntry[];
  sharedSelectionEntries?: BSDSelectionEntry[];
  sharedSelectionEntryGroups?: BSDSelectionEntryGroup[];
  sharedProfiles?: BSDProfile[];
  sharedRules?: BSDRule[];
  sharedInfoGroups?: BSDInfoGroup[];
  sharedForceEntries?: BSDForceEntry[];
  publications?: BSDPublication[];
  [key: string]: any;
}

/**
 * Roster 接口（来自 roster.schema.json）
 */
export interface BSDRoster {
  xmlns?: string;
  type: "roster";
  id: string;
  name: string;
  gameSystemId: string;
  gameSystemRevision?: number;
  battleScribeVersion?: string;
  comment?: string;
  
  forces?: BSDForceEntry[];
  costs?: BSDCost[];
  profiles?: BSDProfile[];
  rules?: BSDRule[];
  [key: string]: any;
}

/**
 * XML 解析后的根类型
 */
export type BSDXmlRoot = 
  | { catalogue: BSDCatalogue }
  | { gameSystem: BSDGameSystem }
  | { roster: BSDRoster };

/**
 * 统一的 BSData 类型
 */
export type BSDData = BSDCatalogue | BSDGameSystem | BSDRoster;
