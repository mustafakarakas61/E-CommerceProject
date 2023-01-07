import React, { FC, ReactElement } from "react";
import { Select } from "antd";
import {SearchProduct} from "../../types/types";

const searchByData = [
    { label: "Kategori", value: SearchProduct.TYPE },
    { label: "Ürün Adı", value: SearchProduct.PRODUCT_TITLE },
    { label: "Ürün Tipi", value: SearchProduct.PRODUCT_TYPE }
];

type PropsType = {
    handleChangeSelect: (value: SearchProduct) => void;
};

const SelectSearchData: FC<PropsType> = ({ handleChangeSelect }): ReactElement => {
    return (
        <Select defaultValue={SearchProduct.TYPE} onChange={handleChangeSelect} style={{ width: 250 }}>
            {searchByData.map((value, index) => (
                <Select.Option key={index} value={value.value}>
                    {value.label}
                </Select.Option>
            ))}
        </Select>
    );
};

export default SelectSearchData;
