package com.blck.planner.userData.Initiative;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/users")
public class InitiativeController {

    private final InitiativeRepository initiativeRepository;

    @Autowired
    public InitiativeController(InitiativeRepository initiativeRepository) {
        this.initiativeRepository = initiativeRepository;
    }

    @GetMapping("/userInitiatives")
    public List<InitiativeDTO> getInitiatives(@AuthenticationPrincipal Jwt jwt) {
        return initiativeRepository.findByUserID(jwt.getClaim("sub")).stream()
                .map(Initiative::toDTO)
                .toList();
    }

    @GetMapping("/userInitiative/{initiativeId}")
    public InitiativeDTO getInitiative(@AuthenticationPrincipal Jwt jwt, @PathVariable String initiativeId) {
        return initiativeRepository.findByUserIDAndItemID(jwt.getClaim("sub"), UUID.fromString(initiativeId)).toDTO();
    }

    @PutMapping("/userInitiative")
    public InitiativeDTO setInitiative(@AuthenticationPrincipal Jwt jwt, @RequestBody InitiativeDTO initiativeDTO) {
        return initiativeRepository.save(initiativeDTO.toInitiative(jwt.getClaim("sub"))).toDTO();
    }

    @Transactional
    @DeleteMapping("/userInitiative/{initiativeID}")
    public String deleteWorkItem(@AuthenticationPrincipal Jwt jwt, @PathVariable String initiativeID) {
        initiativeRepository.deleteByUserIDAndItemID(jwt.getClaim("sub"), UUID.fromString(initiativeID));
        return "User initiative removed successfully.";
    }

}
