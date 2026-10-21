package com.expensesplitter.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaForwardController {

    // Forward non-API client routes to React's index.html
    @GetMapping(value = {
        "/",
        "/groups",
        "/groups/**",
        "/add-expense",
        "/expenses",
        "/balances",
        "/simplify",
        "/settlements"
    })
    public String forwardClientRoutes() {
        return "forward:/index.html";
    }
}
