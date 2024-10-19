package com.example.petcareproject.Services;

import com.example.petcareproject.Controller.OrderController;
import com.example.petcareproject.Model.*;
import com.example.petcareproject.Repository.*;
import com.example.petcareproject.dto.OrderDTO;
import com.example.petcareproject.dto.OrderDetailDTO;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.mail.javamail.MimeMessageHelper;

@Service
public class OrderService {

    @Autowired
    private ProductDetailRepository productDetailRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StatusOrderRepository statusOrderRepository;

    @Autowired
    private EmailService emailService; // Thêm EmailService vào đây

    public void processOrder(OrderController.CheckoutRequest request) {
        // Tìm người dùng theo userId
        Order order = new Order();
        OrderDTO orderDTO = new OrderDTO();
        User user = userRepository.findById(request.userId)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        orderDTO.setPaymentMethod(request.getPaymentMethod());
        // Tạo đối tượng Order
        order.setOrderDate(new java.util.Date());
        if ("COD".equalsIgnoreCase(request.paymentMethod))  {
            order.setPaymentMethod("Thanh toán khi nhận hàng"); // Cash on Delivery
            order.setPaymentStatus("Chưa thanh toán");
        } else if ("VNPAY".equalsIgnoreCase(request.paymentMethod)) {
            order.setPaymentMethod("Thanh toán bằng VNPay"); // VNPay
            order.setPaymentStatus("Đã thanh toán");
        } else {
            order.setPaymentMethod("Không xác định"); // Handle unexpected payment methods
            order.setPaymentStatus("Chưa thanh toán");
        }

        order.setShippingAddress(request.address);
        order.setShippingCost(15000); // Phí vận chuyển
        order.setTotalAmount(request.total + 15000); // Tổng tiền + phí vận chuyển
        order.setType(true);
        order.setPointEarned(0);
        order.setPointUsed(0);
        order.setUser(user);

        // Truy xuất trạng thái từ cơ sở dữ liệu
        StatusOrder defaultStatus = new StatusOrder();
        defaultStatus.setStatusOrderId(1L); // ID cho "Chờ xác nhận"
        order.setStatusOrder(defaultStatus);

        // Lưu Order vào DB
        Order savedOrder = orderRepository.save(order);

        // Lưu chi tiết đơn hàng (OrderDetail)
        for (OrderDetailDTO productDTO : request.products) {
            // Tìm sản phẩm theo productDetailId
            ProductDetail productDetail = productDetailRepository.findById(productDTO.getProductDetailId())
                    .orElseThrow(() -> new RuntimeException("Sản phẩm không tồn tại"));

            // Tạo và lưu OrderDetail
            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setQuantity(productDTO.getQuantity());
            orderDetail.setPrice(productDTO.getPrice());
            orderDetail.setOrder(savedOrder);
            orderDetail.setProductDetail(productDetail); // Gán ProductDetail tìm được
            orderDetailRepository.save(orderDetail);
        }

    }

    @Transactional
    public void updateOrderStatus(Long orderId, Long statusId) {
        // Tìm đơn hàng theo orderId
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));

        // Tìm trạng thái mới theo statusId
        StatusOrder statusOrder = statusOrderRepository.findById(statusId)
                .orElseThrow(() -> new RuntimeException("StatusOrder not found with ID: " + statusId));

        // Cập nhật trạng thái của đơn hàng
        order.setStatusOrder(statusOrder);

        // Lưu lại đơn hàng sau khi cập nhật
        orderRepository.save(order);
    }

    private OrderDetailDTO convertToOrderDetailDTO(OrderDetail orderDetail) {
        OrderDetailDTO orderDetailDTO = new OrderDetailDTO();
        orderDetailDTO.setProductDetailId(orderDetail.getProductDetail().getProductDetailId());
        orderDetailDTO.setQuantity(orderDetail.getQuantity());
        orderDetailDTO.setPrice(orderDetail.getPrice());
        orderDetailDTO.setOrderId(orderDetail.getOrder().getOrderId());

        // Lấy thông tin sản phẩm
        ProductDetail productDetail = orderDetail.getProductDetail();
        Product product = productDetail.getProduct();

        // Thiết lập thông tin sản phẩm trong DTO
        orderDetailDTO.setProductId(product.getProductId());
        orderDetailDTO.setProductName(product.getProductName());
        orderDetailDTO.setProductImage(product.getImageUrl());
        orderDetailDTO.setProductPrice(productDetail.getPrice());
        orderDetailDTO.setProductCategory(product.getCategory().getCategogyName());
        orderDetailDTO.setProductBrand(product.getBrand().getBrandName());

        return orderDetailDTO;
    }

    public OrderDTO convertToOrderDTO(Order order) {
        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setOrderId(order.getOrderId());
        orderDTO.setOrderDate(order.getOrderDate().toString());
        orderDTO.setTotalAmount(order.getTotalAmount());
        orderDTO.setStatus(order.getStatusOrder().getStatusName());

        // Lấy statusOrderId từ StatusOrder
        orderDTO.setStatusOrderId(orderDTO.getStatusOrderId());
        orderDTO.setStatusOrderId(order.getStatusOrder().getStatusOrderId());

        orderDTO.setPaymentMethod(order.getPaymentMethod());
        orderDTO.setShippingAddress(order.getShippingAddress());

        // Truy vấn danh sách OrderDetail
        List<OrderDetail> orderDetails = orderDetailRepository.findByOrder_OrderId(order.getOrderId());
        List<OrderDetailDTO> orderDetailDTOs = orderDetails.stream()
                .map(this::convertToOrderDetailDTO)
                .collect(Collectors.toList());

        orderDTO.setOrderDetails(orderDetailDTOs);

        return orderDTO;
    }

    public OrderDTO getOrderDetails(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));

        // Chuyển đổi Order thành OrderDTO, bao gồm cả địa chỉ
        OrderDTO orderDTO = convertToOrderDTO(order);
        orderDTO.setShippingAddress(order.getShippingAddress()); // Thêm thông tin địa chỉ
        return orderDTO;
    }

    public List<OrderDTO> getUserOrders(Long userId) {
        List<Order> orders = orderRepository.findByUser_UserId(userId);

        return orders.stream()
                .map(order -> {
                    OrderDTO orderDTO = convertToOrderDTO(order);

                    // Lấy thông tin người dùng và che thông tin nhạy cảm
                    User user = order.getUser();
                    String maskedPhone = maskPhoneNumber(user.getPhone());
                    String maskedEmail = maskEmail(user.getEmail());

                    orderDTO.setFullName(user.getFullName());
                    orderDTO.setPhoneNumber(maskedPhone);
                    orderDTO.setEmail(maskedEmail);

                    return orderDTO;
                })
                .collect(Collectors.toList());
    }

    // Che số điện thoại, chỉ hiển thị 3 số đầu và 3 số cuối
    private String maskPhoneNumber(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.length() < 10) {
            return phoneNumber;
        }
        return phoneNumber.substring(0, 3) + "****" + phoneNumber.substring(7);
    }

    // Che email, chỉ hiển thị ký tự đầu và tên miền
    private String maskEmail(String email) {
        int atIndex = email.indexOf("@");
        if (atIndex <= 1) {
            return email;
        }
        return email.substring(0, 1) + "****" + email.substring(atIndex);
    }

    public List<OrderDTO> getOrdersByUserId(Long userId) {
        List<Order> orders = orderRepository.findByUser_UserId(userId);

        return orders.stream()
                .map(this::convertToOrderDTO)
                .collect(Collectors.toList());
    }

    public List<OrderDTO> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        List<OrderDTO> orderDTOs = new ArrayList<>();

        for (Order order : orders) {
            // Log thông tin đơn hàng
            System.out.println("Đơn hàng ID: " + order.getOrderId());

            OrderDTO orderDTO = new OrderDTO();
            orderDTO.setOrderId(order.getOrderId()); // Đảm bảo này được gọi
            orderDTO.setOrderDate(order.getOrderDate().toString());
            orderDTO.setTotalAmount(order.getTotalAmount());
            orderDTO.setPaymentMethod(order.getPaymentMethod());
            orderDTO.setShippingAddress(order.getShippingAddress());
            orderDTO.setFullName(order.getUser().getFullName());
            orderDTO.setPhoneNumber(order.getUser().getPhone());
            orderDTO.setEmail(order.getUser().getEmail());

            // Lấy userId
            orderDTO.setUserId(order.getUser().getUserId());

            // Lấy statusName
            orderDTO.setStatusOrderId(order.getStatusOrder().getStatusOrderId());
            orderDTO.setStatus(order.getStatusOrder().getStatusName());

            // Lấy chi tiết đơn hàng
            List<OrderDetail> orderDetails = orderDetailRepository.findByOrder(order);
            List<OrderDetailDTO> orderDetailDTOs = new ArrayList<>();
            for (OrderDetail orderDetail : orderDetails) {
                OrderDetailDTO orderDetailDTO = new OrderDetailDTO();
                orderDetailDTO.setProductDetailId(orderDetail.getProductDetail().getProductDetailId());
                orderDetailDTO.setProductId(orderDetail.getProductDetail().getProduct().getProductId());
                orderDetailDTO.setProductName(orderDetail.getProductDetail().getProduct().getProductName());
                orderDetailDTO.setProductPrice(orderDetail.getProductDetail().getPrice());
                orderDetailDTO.setQuantity(orderDetail.getQuantity());
                orderDetailDTO.setPrice(orderDetail.getPrice());
                orderDetailDTO.setProductImage(orderDetail.getProductDetail().getProduct().getImageUrl());

                orderDetailDTOs.add(orderDetailDTO);
            }
            orderDTO.setOrderDetails(orderDetailDTOs);
            orderDTOs.add(orderDTO);
        }

        return orderDTOs;
    }

    public void sendOrderCancellationEmail(Long orderId, String cancellationReason) {
        // Lấy thông tin đơn hàng từ database
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));

        User user = order.getUser();
        if (user == null) {
            throw new RuntimeException("Người dùng không tồn tại cho đơn hàng ID: " + orderId);
        }

        MimeMessage message = emailService.createMimeMessage();
        MimeMessageHelper helper;

        try {
            helper = new MimeMessageHelper(message, true);
            helper.setTo(user.getEmail()); // Địa chỉ email mà bạn muốn gửi đến
            helper.setSubject("Thông Báo Hủy Đơn Hàng #" + order.getOrderId() + " từ PetCare");

            StringBuilder emailBody = new StringBuilder();

            emailBody.append("<div style='background-color: #f4f4f4; padding: 20px;'>")
                    .append("<div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);'>")
                    .append("<div style='background-color: #00b7c0; padding: 15px; text-align: center;'>")
                    .append("<h1 style='color: #ffffff; font-family: Arial, sans-serif;'>PetCare</h1>")
                    .append("</div>")
                    .append("<div style='padding: 20px; font-family: Arial, sans-serif;'>")
                    .append("<h2>Kính gửi Quý khách hàng ").append(user.getFullName()).append(",</h2>")
                    .append("<p>Chúng tôi xin chân thành cảm ơn Quý khách đã tin tưởng và lựa chọn mua sắm tại PetCare.</p>")
                    .append("<p>Rất tiếc phải thông báo rằng đơn hàng <strong>#").append(order.getOrderId()).append("</strong> của Quý khách đã bị hủy.</p>")
                    .append("<h3 style='color: #00b7c0;'>Thông tin đơn hàng:</h3>")
                    .append("<ul style='list-style: none; padding: 0;'>")
                    .append("<li><strong>Mã đơn hàng:</strong> #").append(order.getOrderId()).append("</li>")
                    .append("<li><strong>Ngày đặt hàng:</strong> ").append(order.getOrderDate()).append("</li>")
                    .append("<li><strong>Tên khách hàng:</strong> ").append(user.getFullName()).append("</li>")
                    .append("<li><strong>Phương thức thanh toán:</strong> ").append(order.getPaymentMethod()).append("</li>")
                    .append("<li><strong>Địa chỉ giao hàng:</strong> ").append(order.getShippingAddress()).append("</li>")
                    .append("</ul>")

                    // Chi tiết sản phẩm
                    .append("<h3 style='color: #00b7c0;'>Sản phẩm đã đặt:</h3>")
                    .append("<table style='width:100%; border-collapse: collapse;'>")
                    .append("<tr style='background-color: #00b7c0; color: #ffffff;'>")
                    .append("<th style='padding: 8px; border: 1px solid #ddd;'>Hình Sản Phẩm</th>")
                    .append("<th style='padding: 8px; border: 1px solid #ddd;'>Tên Sản Phẩm</th>")
                    .append("<th style='padding: 8px; border: 1px solid #ddd;'>Số Lượng</th>")
                    .append("<th style='padding: 8px; border: 1px solid #ddd;'>Giá</th>")
                    .append("</tr>");

            List<OrderDetail> orderDetails = orderDetailRepository.findByOrder(order);
            for (OrderDetail detail : orderDetails) {
                emailBody.append("<tr>")
                        .append("<td style='padding: 8px; border: 1px solid #ddd; text-align: center;'><img src='")
                        .append(detail.getProductDetail().getProduct().getImageUrl())
                        .append("' width='100' height='100' style='border-radius: 8px;'></td>")
                        .append("<td style='padding: 8px; border: 1px solid #ddd;'>")
                        .append(detail.getProductDetail().getProduct().getProductName()).append("</td>")
                        .append("<td style='padding: 8px; border: 1px solid #ddd; text-align: center;'>")
                        .append(detail.getQuantity()).append("</td>")
                        .append("<td style='padding: 8px; border: 1px solid #ddd; text-align: right;'>")
                        .append(detail.getPrice()).append(" VND</td>")
                        .append("</tr>");
            }

            emailBody.append("</table>")
                    .append("<p><strong>Tổng giá trị đơn hàng: </strong><span style='color: #00b7c0;'>")
                    .append(order.getTotalAmount()).append(" VND</span></p>")

                    .append("<h3 style='color: #00b7c0;'>Liên hệ:</h3>")
                    .append("<p>Để hỗ trợ thêm, Quý khách có thể liên hệ với chúng tôi qua:</p>")
                    .append("<ul style='list-style-type: none; padding-left: 0;'>")
                    .append("<li><strong>Hotline:</strong> 0987654321</li>")
                    .append("<li><strong>Email:</strong> Duyenttmpc08066@fpt.edu.vn</li>")
                    .append("<li><strong>Website:</strong> <a href='https://petcare.com' style='color: #00b7c0;'>petcare.com</a></li>")
                    .append("</ul>")

                    .append("<p>Chúng tôi mong sẽ có cơ hội phục vụ Quý khách trong tương lai. Cảm ơn Quý khách đã chọn PetCare.</p>")
                    .append("<p>Trân trọng,<br>PetCare<br>Thành phố Cần Thơ<br>0987654321</p>")
                    .append("</div>")
                    .append("</div>")
                    .append("</div>");

            helper.setText(emailBody.toString(), true); // true indicates HTML
            emailService.send(message);
        } catch (MessagingException e) {
            System.err.println("Error sending email: " + e.getMessage());
            e.printStackTrace(); // Xử lý lỗi nếu có
        }
    }

    public void cancelOrder(Long orderId) {
        // Lấy đơn hàng từ cơ sở dữ liệu
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        // Cập nhật trạng thái đơn hàng
        StatusOrder cancelStatus = statusOrderRepository.findById(5L) // Giả sử ID 5 là trạng thái "Hủy"
                .orElseThrow(() -> new ResourceNotFoundException("Status not found for ID: 5"));
        order.setStatusOrder(cancelStatus);
        orderRepository.save(order);
    }

    public void processOrderCancellation(Long orderId, String cancelReason) {
        // Hủy đơn hàng
        cancelOrder(orderId); // Gọi phương thức hủy đơn hàng

        // Gửi email thông báo hủy đơn hàng
        try {
            sendOrderCancellationEmail(orderId, cancelReason); // Gọi phương thức gửi email với lý do
        } catch (Exception e) {
            System.err.println("Error sending cancellation email: " + e.getMessage());
            // Bạn có thể xử lý lỗi hoặc ghi log tại đây
        }
    }
}


