package com.erp.service;

import com.erp.entity.Employee;
import com.erp.repository.EmployeeRepository;
import com.erp.exception.DuplicateResourceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Optional<Employee> getEmployeeById(Long id) {
        return employeeRepository.findById(id);
    }

    public Employee createEmployee(Employee employee) {
        if (employeeRepository.findByEmployeeId(employee.getEmployeeId()).isPresent()) {
            throw new DuplicateResourceException("Employee", "employeeId", employee.getEmployeeId());
        }
        if (employeeRepository.findByWorkEmail(employee.getWorkEmail()).isPresent()) {
            throw new DuplicateResourceException("Employee", "workEmail", employee.getWorkEmail());
        }
        return employeeRepository.save(employee);
    }

    public Employee updateEmployee(Long id, Employee employeeDetails) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));

        // Update fields (Basic)
        employee.setFirstName(employeeDetails.getFirstName());
        employee.setMiddleName(employeeDetails.getMiddleName());
        employee.setLastName(employeeDetails.getLastName());
        employee.setDesignation(employeeDetails.getDesignation());
        employee.setDepartment(employeeDetails.getDepartment());
        employee.setWorkLocation(employeeDetails.getWorkLocation());
        employee.setMobileNumber(employeeDetails.getMobileNumber());
        employee.setDirector(employeeDetails.isDirector());
        employee.setPortalAccessEnabled(employeeDetails.isPortalAccessEnabled());

        // Update Salary
        employee.setAnnualCtc(employeeDetails.getAnnualCtc());
        employee.setBasicSalary(employeeDetails.getBasicSalary());
        employee.setHra(employeeDetails.getHra());
        employee.setSpecialAllowances(employeeDetails.getSpecialAllowances());

        // Update Personal
        employee.setDateOfBirth(employeeDetails.getDateOfBirth());
        employee.setFatherName(employeeDetails.getFatherName());
        employee.setPersonalEmail(employeeDetails.getPersonalEmail());
        employee.setPresentAddress(employeeDetails.getPresentAddress());
        employee.setPermanentAddress(employeeDetails.getPermanentAddress());

        // Update Payment
        employee.setPaymentMode(employeeDetails.getPaymentMode());
        employee.setBankName(employeeDetails.getBankName());
        employee.setAccountNumber(employeeDetails.getAccountNumber());
        employee.setIfscCode(employeeDetails.getIfscCode());
        employee.setAccountHolderName(employeeDetails.getAccountHolderName());
        employee.setPanNumber(employeeDetails.getPanNumber());

        return employeeRepository.save(employee);
    }

    public void deleteEmployee(Long id) {
        employeeRepository.deleteById(id);
    }
}
