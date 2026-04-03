package org.boduha.server;

import java.util.List;

public record Question(Integer id, String statement, List<Alternative> alternatives) {}
