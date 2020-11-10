import { v4 as uuidV4 } from "uuid";


export interface ShippingAddress {
  name: string;
  phone_number: string;
  company_name?: string | null;
  address_line1: string;
  address_line2?: string | null;
  address_line3?: string | null;
  city_locality: string;
  state_province: string;
  postal_code: string;
  country_code: string;
  address_residential_indicator: AddressResidentialIndicator;
  nickname?: string | null;
}

export enum AddressResidentialIndicator {
  no = "no",
  yes = "yes",
  unknown = "unknown"
}

export interface AdvancedOptions {
  bill_to_account?: string | null;
  bill_to_country_code?: string | null;
  bill_to_party?: string | null;
  bill_to_postal_code?: string | null;
  contains_alcohol?: boolean;
  delivered_duty_paid?: boolean;
  dry_ice?: boolean;
  dry_ice_weight?: DryIceWeight | null;
  non_machinable?: boolean;
  saturday_delivery?: boolean;
  use_ups_ground_freight_pricing?: boolean | null;
  freight_class?: string | null;
  custom_field1?: string | null;
  custom_field2?: string | null;
  custom_field3?: string | null;
  collect_on_delivery?: CollectOnDelivery;
}

export interface CollectOnDelivery {
  payment_type?: string;
  payment_amount?: PaymentAmount;
}

export interface PaymentAmount {
  currency?: string;
  amount?: number;
}

export interface DryIceWeight {
  value: number;
  unit: string;
}

export interface Items {
  name?: string;
  sales_order_id?: string | null;
  sales_order_item_id?: string | null;
  quantity?: number;
  sku?: string | null;
  external_order_id?: string | null;
  external_order_item_id?: string | null;
  asin?: string | null;
  order_source_code?: string;
}

export interface CustomsValue {
  currency: string;
  amount: number;
}

export interface CustomsItems {
  description?: string | null;
  quantity?: number;
  value?: CustomsValue;
  harmonized_tariff_code?: string | null;
  country_of_origin?: string | null;
  unit_of_measure?: string | null;
  sku?: string | null;
  sku_description?: string | null;
}

export interface Customs {
  contents: string;
  non_delivery: string;
  customs_items: CustomsItems[];
}

export interface Packages {
  package_code?: string;
  weight: PackageWeight;
  dimensions?: PackageDimensions;
  insured_value?: PackageInsuredValue;
  label_messages?: LabelMessages;
  external_package_id?: string;
}

export interface PackageWeight {
  value: number;
  unit: string;
}

export interface PackageDimensions {
  unit: string;
  length: number;
  width: number;
  height: number;
}

export interface PackageInsuredValue {
  currency: string;
  amount: string
}

export interface LabelMessages {
  reference1: string | null;
  reference2: string | null;
  reference3: string | null;
}

export interface Shipment {
  carrier_id: string;
  service_code: string;
  external_order_id?: string | null;
  items?: Items[],
  external_shipment_id?: string | null;
  ship_date: string;
  ship_to: ShippingAddress;
  ship_from: ShippingAddress;
  warehouse_id?: string | null;
  return_to: ShippingAddress;
  confirmation: string;
  customs?: Customs | null;
  advanced_options?: AdvancedOptions;
  insurance_provider: string;
  order_source_code?: string;
  packages: Packages[];
}

export interface PurchaseLabelRequest {
  shipment: Shipment,
  is_return_label?: boolean;
  rma_number?: string | null;
  charge_event?: string;
  outbound_label_id?: string;
  validate_address?: string;
  label_download_type?: string;
  label_format?: string;
  label_image_id?: string | null;
}
