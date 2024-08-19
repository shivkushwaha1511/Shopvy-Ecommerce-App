import React, { useEffect } from "react";
import "./Invoice.css";
import { Link, useParams } from "react-router-dom";
import { useGetOrderDetailQuery } from "../../redux/api/orderApi";
import toast from "react-hot-toast";
import Loader from "../layout/Loader";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const Invoice = () => {
  const { orderId } = useParams();
  const { data, isLoading, error } = useGetOrderDetailQuery(orderId);

  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    user,
    itemsPrice,
    taxAmount,
    shippingAmount,
    totalAmount,
  } = data?.order || {};

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
  }, [error]);

  if (isLoading) {
    return <Loader />;
  }

  const handleDownload = () => {
    const element = document.getElementById("order_invoice");
    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF();
      const pdfWidth = pdf.internal.pageSize.getWidth();
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, 0);
      pdf.save(`invoice_${orderId}.pdf`);
    });
  };

  return (
    <div className="order-invoice my-5">
      <div className="row d-flex justify-content-center mb-5">
        <button className="btn btn-success col-md-5" onClick={handleDownload}>
          <i className="fa fa-print"></i> Download Invoice
        </button>
      </div>
      <div id="order_invoice" className="p-3 border border-secondary">
        <header className="clearfix">
          <div id="logo">
            <img src="/images/invoice-logo.png" alt="Company Logo" />
          </div>
          <h1>INVOICE # {orderId}</h1>
          <div id="company" className="clearfix">
            <div>ShopIT</div>
            <div>
              455 Foggy Heights,
              <br />
              AZ 85004, US
            </div>
            <div>(602) 519-0450</div>
            <div>
              <Link to="mailto:info@shopit.com">info@shopit.com</Link>
            </div>
          </div>
          <div id="project">
            <div>
              <span>Name</span> {user?.name}
            </div>
            <div>
              <span>EMAIL</span> {user?.email}
            </div>
            <div>
              <span>PHONE</span> {shippingInfo?.phoneNo}
            </div>
            <div>
              <span>ADDRESS</span> {shippingInfo?.address}, {shippingInfo?.city}
              , {shippingInfo?.state}, {shippingInfo?.country?.name} -{" "}
              {shippingInfo?.zipCode}
            </div>
            <div>
              <span>DATE</span>{" "}
              {new Date(data?.order?.createdAt).toLocaleString("en-us")}
            </div>
            <div>
              <span>Status</span> {paymentInfo?.status}
            </div>
          </div>
        </header>
        <main>
          <table className="mt-5">
            <thead>
              <tr>
                <th className="service">ID</th>
                <th className="desc">NAME</th>
                <th>PRICE</th>
                <th>QTY</th>
                <th>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item) => (
                <tr>
                  <td className="service">{item?._id}</td>
                  <td className="desc">{item?.name}</td>
                  <td className="unit">{item?.price}</td>
                  <td className="qty">{item?.quantity}</td>
                  <td className="total">
                    &#8377; {item?.quantity * item?.price}
                  </td>
                </tr>
              ))}

              <tr>
                <td colspan="4">
                  <b>SUBTOTAL</b>
                </td>
                <td className="total">&#8377; {itemsPrice}</td>
              </tr>

              <tr>
                <td colspan="4">
                  <b>TAX 5%</b>
                </td>
                <td className="total">&#8377; {taxAmount}</td>
              </tr>

              <tr>
                <td colspan="4">
                  <b>SHIPPING</b>
                </td>
                <td className="total">&#8377; {shippingAmount}</td>
              </tr>

              <tr>
                <td colspan="4" className="grand total">
                  <b>GRAND TOTAL</b>
                </td>
                <td className="grand total">&#8377; {totalAmount}</td>
              </tr>
            </tbody>
          </table>
          <div id="notices">
            <div>NOTICE:</div>
            <div className="notice">
              A finance charge of 1.5% will be made on unpaid balances after 30
              days.
            </div>
          </div>
        </main>
        <footer>
          Invoice was created on a computer and is valid without the signature.
        </footer>
      </div>
    </div>
  );
};

export default Invoice;
