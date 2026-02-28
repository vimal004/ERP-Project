package com.erp.service;

import com.erp.entity.Employee;
import com.erp.repository.EmployeeRepository;
import com.erp.exception.DuplicateResourceException;
import com.erp.exception.ResourceNotFoundException;
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
        // Validate required fields
        validateEmployee(employee);

        if (employeeRepository.findByEmployeeId(employee.getEmployeeId()).isPresent()) {
            throw new DuplicateResourceException("Employee", "employeeId", employee.getEmployeeId());
        }
        if (employeeRepository.findByWorkEmail(employee.getWorkEmail()).isPresent()) {
            throw new DuplicateResourceException("Employee", "workEmail", employee.getWorkEmail());
        }

        // Default status to ACTIVE if not set
        if (employee.getStatus() == null) {
            employee.setStatus(Employee.EmployeeStatus.ACTIVE);
        }

        return employeeRepository.save(employee);
    }

    public Employee updateEmployee(Long id, Employee employeeDetails) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id.toString()));

        // Check for duplicate employeeId on update (if changed)
        if (employeeDetails.getEmployeeId() != null &&
                !employeeDetails.getEmployeeId().equals(employee.getEmployeeId())) {
            employeeRepository.findByEmployeeId(employeeDetails.getEmployeeId()).ifPresent(existing -> {
                if (!existing.getId().equals(id)) {
                    throw new DuplicateResourceException("Employee", "employeeId", employeeDetails.getEmployeeId());
                }
            });
        }

        // Check for duplicate workEmail on update (if changed)
        if (employeeDetails.getWorkEmail() != null &&
                !employeeDetails.getWorkEmail().equals(employee.getWorkEmail())) {
            employeeRepository.findByWorkEmail(employeeDetails.getWorkEmail()).ifPresent(existing -> {
                if (!existing.getId().equals(id)) {
                    throw new DuplicateResourceException("Employee", "workEmail", employeeDetails.getWorkEmail());
                }
            });
        }

        // Update Basic Details
        if (employeeDetails.getFirstName() != null) employee.setFirstName(employeeDetails.getFirstName());
        if (employeeDetails.getLastName() != null) employee.setLastName(employeeDetails.getLastName());
        employee.setMiddleName(employeeDetails.getMiddleName());
        if (employeeDetails.getEmployeeId() != null) employee.setEmployeeId(employeeDetails.getEmployeeId());
        if (employeeDetails.getDateOfJoining() != null) employee.setDateOfJoining(employeeDetails.getDateOfJoining());
        if (employeeDetails.getWorkEmail() != null) employee.setWorkEmail(employeeDetails.getWorkEmail());
        employee.setMobileNumber(employeeDetails.getMobileNumber());
        if (employeeDetails.getGender() != null) employee.setGender(employeeDetails.getGender());
        employee.setWorkLocation(employeeDetails.getWorkLocation());
        employee.setDesignation(employeeDetails.getDesignation());
        employee.setDepartment(employeeDetails.getDepartment());
        employee.setDirector(employeeDetails.isDirector());
        employee.setPortalAccessEnabled(employeeDetails.isPortalAccessEnabled());

        // Update Status
        if (employeeDetails.getStatus() != null) employee.setStatus(employeeDetails.getStatus());

        // Update Salary — only overwrite when incoming value is non-null
        if (employeeDetails.getAnnualCtc() != null) employee.setAnnualCtc(employeeDetails.getAnnualCtc());
        if (employeeDetails.getBasicSalary() != null) employee.setBasicSalary(employeeDetails.getBasicSalary());
        if (employeeDetails.getHra() != null) employee.setHra(employeeDetails.getHra());
        if (employeeDetails.getSpecialAllowances() != null) employee.setSpecialAllowances(employeeDetails.getSpecialAllowances());

        // Update Personal — only overwrite when incoming value is non-null
        if (employeeDetails.getDateOfBirth() != null) employee.setDateOfBirth(employeeDetails.getDateOfBirth());
        if (employeeDetails.getFatherName() != null) employee.setFatherName(employeeDetails.getFatherName());
        if (employeeDetails.getPersonalEmail() != null) employee.setPersonalEmail(employeeDetails.getPersonalEmail());
        if (employeeDetails.getPresentAddress() != null) employee.setPresentAddress(employeeDetails.getPresentAddress());
        if (employeeDetails.getPermanentAddress() != null) employee.setPermanentAddress(employeeDetails.getPermanentAddress());

        // Update Payment — only overwrite when incoming value is non-null
        if (employeeDetails.getPaymentMode() != null) employee.setPaymentMode(employeeDetails.getPaymentMode());
        if (employeeDetails.getBankName() != null) employee.setBankName(employeeDetails.getBankName());
        if (employeeDetails.getAccountNumber() != null) employee.setAccountNumber(employeeDetails.getAccountNumber());
        if (employeeDetails.getIfscCode() != null) employee.setIfscCode(employeeDetails.getIfscCode());
        if (employeeDetails.getAccountHolderName() != null) employee.setAccountHolderName(employeeDetails.getAccountHolderName());
        if (employeeDetails.getPanNumber() != null) employee.setPanNumber(employeeDetails.getPanNumber());

        return employeeRepository.save(employee);
    }

    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id.toString()));
        employeeRepository.delete(employee);
    }

    private void validateEmployee(Employee employee) {
        if (employee.getFirstName() == null || employee.getFirstName().isBlank()) {
            throw new IllegalArgumentException("First name is required");
        }
        if (employee.getLastName() == null || employee.getLastName().isBlank()) {
            throw new IllegalArgumentException("Last name is required");
        }
        if (employee.getEmployeeId() == null || employee.getEmployeeId().isBlank()) {
            throw new IllegalArgumentException("Employee ID is required");
        }
        if (employee.getWorkEmail() == null || employee.getWorkEmail().isBlank()) {
            throw new IllegalArgumentException("Work email is required");
        }
        if (employee.getDateOfJoining() == null) {
            throw new IllegalArgumentException("Date of joining is required");
        }
    }
}
