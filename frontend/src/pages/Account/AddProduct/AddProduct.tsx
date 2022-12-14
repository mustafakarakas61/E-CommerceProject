import React, { FC, ReactElement, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Form, notification, Row, Upload } from "antd";
import { PlusSquareFilled, PlusSquareOutlined, UploadOutlined } from "@ant-design/icons";
import { UploadChangeParam } from "antd/lib/upload/interface";

import {
    selectAdminStateErrors,
    selectIsAdminStateLoading,
    selectIsProductAdded
} from "../../../redux-toolkit/admin/admin-selector";
import { resetAdminState, setAdminLoadingState } from "../../../redux-toolkit/admin/admin-slice";
import { LoadingStatus } from "../../../types/types";
import { addProduct } from "../../../redux-toolkit/admin/admin-thunks";
import ContentTitle from "../../../components/ContentTitle/ContentTitle";
import AddFormInput from "./AddFormInput";
import AddFormSelect from "./AddFormSelect";
import IconButton from "../../../components/IconButton/IconButton";
import {selectTotalPrice} from "../../../redux-toolkit/cart/cart-selector";
import {selectFilename} from "../../../redux-toolkit/products/products-selector";

type AddProductData = {
    productTitle: string;
    producer: string;
    description: string;
    year: string;
    city: string;
    type: string;
    productType: string;
    colors: string;
    price: string;
};

const AddProduct: FC = (): ReactElement => {
    const dispatch = useDispatch();
    const isProductAdded = useSelector(selectIsProductAdded);
    const ispProductLoading = useSelector(selectIsAdminStateLoading);
    const productErrors = useSelector(selectAdminStateErrors);
    const [file, setFile] = React.useState<string>("");

    useEffect(() => {
        dispatch(setAdminLoadingState(LoadingStatus.LOADED));

        return () => {
            dispatch(resetAdminState(LoadingStatus.LOADING));
        };
    }, []);

    useEffect(() => {
        if (isProductAdded) {
            window.scrollTo(0, 0);
            notification.success({
                message: "Ürün eklendi",
                description: "Ürün başarıyla eklendi!"
            });
            dispatch(resetAdminState(LoadingStatus.SUCCESS));
        }
    }, [isProductAdded]);

    const onFormSubmit = (data: AddProductData): void => {
        const bodyFormData: FormData = new FormData();
        // @ts-ignore
       // bodyFormData.append("file", { file });
        bodyFormData.append(
            "product",
            new Blob([JSON.stringify({ ...data, productRating:0 })], { type: "application/json" })
        );

        dispatch(addProduct(bodyFormData));
    };

    const handleUpload = ({ file }: UploadChangeParam<any>): void => {
        setFile(file);
    };

    return (
        <>
            <ContentTitle title={"Ürün ekle"} titleLevel={4} icon={<PlusSquareOutlined />} />
            <Form onFinish={onFormSubmit}>
                <Row gutter={32}>
                    <Col span={12}>
                        <AddFormInput
                            title={"Ürün başlığı"}
                            name={"productTitle"}
                            error={productErrors.productTitleError}
                            placeholder={"Ürün başlığını giriniz"}
                            disabled={ispProductLoading}
                        />
                        <AddFormInput
                            title={"Ürün açıklaması"}
                            name={"description"}
                            placeholder={"Ürün açıklamasını giriniz"}
                            disabled={ispProductLoading}
                        />
                        <AddFormInput
                            title={"Üretim yılı"}
                            name={"year"}
                            error={productErrors.yearError}
                            placeholder={"Üretim yılını giriniz"}
                            disabled={ispProductLoading}
                        />
                        <AddFormInput
                            title={"Ürün Kategorisi"}
                            name={"productType"}
                           // error={productErrors.typeError}
                            placeholder={"Elektrikli ev aletleri"}
                            disabled={ispProductLoading}
                            //values={['Elektrikli ev aletleri', 'Elektronik', 'Ev ve Yaşam', 'Giyim', 'Hediyelik', 'Kitaplar', 'Kozmetik', 'Spor']}
                        />
                        <AddFormInput
                            title={"Renkler"}
                            name={"colors"}
                            error={productErrors.colorsError}
                            placeholder={"Ürüne ait renk seçenekleri"}
                            disabled={ispProductLoading}
                        />
                        <AddFormInput
                            title={"Fiyat"}
                            name={"price"}
                            error={productErrors.priceError}
                            placeholder={"Ürünün fiyatını giriniz"}
                            disabled={ispProductLoading}
                        />
                    </Col>
                    <Col span={12}>
                        <AddFormInput
                            title={"Üretici"}
                            name={"producer"}
                            error={productErrors.producerError}
                            placeholder={"Ürünün üretici firma ismini giriniz"}
                            disabled={ispProductLoading}
                        />
                        <AddFormInput
                            title={"Şehir"}
                            name={"city"}
                            error={productErrors.cityError}
                            placeholder={"Şehir giriniz"}
                            disabled={ispProductLoading}
                        />
                        <AddFormInput
                            title={"Resim URL giriniz"}
                            name={"filename"}
                            placeholder={"Resim URL giriniz"}
                            disabled={ispProductLoading}
                        />
                    </Col>
                </Row>
                <IconButton title={"Ekle"} icon={<PlusSquareFilled />} />
            </Form>
        </>
    );
};

export default AddProduct;
