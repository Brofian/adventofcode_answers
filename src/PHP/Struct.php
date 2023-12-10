<?php

namespace src\PHP;


/*
 * $s1 = new Struct();
 * $s1->xyz = "Hello world";
 * echo $s1->xyz;
 */
class Struct {

    public function __get($name)
    {
        return $this->get($name);
    }

    public function __set($name, $value)
    {
        $this->set($name, $value);
    }

    public function __isset(string $name): bool
    {
        return $this->has($name);
    }

    public function get($name, $default = null) {
        return $this->{$name} ?? $default;
    }

    public function set($name, $value): void
    {
        $this->{$name} = $value;
    }

    public function has($name): bool
    {
        return $this->get($name) !== null;
    }

}