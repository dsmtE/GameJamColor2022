
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function compute_slots(slots) {
        const result = {};
        for (const key in slots) {
            result[key] = true;
        }
        return result;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }
    class HtmlTag {
        constructor() {
            this.e = this.n = null;
        }
        c(html) {
            this.h(html);
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                this.e = element(target.nodeName);
                this.t = target;
                this.c(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.4' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const gameName = writable('Childchemy');
    const flowScene = writable();
    const levelsComplete = writable();
    const level = writable();
    const introText = writable(`
<p> Bienvenue dans la cour des grands ! </p>
<p>
    Dans ce jeu dans le style d’un “Little Alchemy”, combine les objets dans la marmite pour en débloquer de nouveaux et résoudre tes problèmes de manière ingénieuse et parfois inattendue !
</p>
<p>
    Laisse libre cours à ton imagination !  Chaque niveau comporte 3 fins : une simple, une complexe et une mauvaise fin.
</p>
<p>
    Sauras-tu toutes les débloquer ?
</p>
`);
    const hiddenAchievement = writable({});

    function makeProgression (reset = false) {
      const progression = {
        levelsComplete: {},
        hiddenAchievement: {}
      };

      if (!reset) {
        progression['levelsComplete'] = get_store_value(levelsComplete);
        progression['hiddenAchievement'] = get_store_value(hiddenAchievement);
      }

      return JSON.stringify(progression)
    }

    function saveProgression (reset = false) {
      const progression = makeProgression(reset);
      localStorage.setItem('progression', progression);
      console.log('Saved progression', progression);
    }

    function loadProgression () {
      const progressionStr =
        localStorage.getItem('progression') || makeProgression();
      const progression = JSON.parse(progressionStr);

      if (progression['levelsComplete'])
        levelsComplete.set(progression['levelsComplete']);

      if (progression['hiddenAchievement'])
        hiddenAchievement.set(progression['hiddenAchievement']);
    }

    var imagesData = {
      Tournesol: { src: 'tournesol' },
      Ciseaux: { src: 'sizo' },
      'Crayons de couleur': { src: 'crayons' },
      Briquet: { src: 'briquet' },
      Échelle: { src: 'echelle' },
      Tissu: { src: 'tissues' },
      Colle: { src: 'colle' },
      'Costume de super-héros': { src: 'costume_sh' },
      'Poudre de perlinpinpin': { src: 'poudre_de_perlinpinpin' },
      Stylo: { src: 'stylo' },
      'Taille-crayon': { src: 'taille_crayon' },
      Téléphone: { src: 'telephone' },
      Terre: { src: 'terre' },
      Tôle: { src: 'tole' },
      Pétards: { src: 'petard' },
      'Huile de tournesol': { src: 'huile' },
      Tronçonneuse: { src: 'tronconneuse' },
      'Tronçonneuse sans huile': { src: 'tronconneuse_sans_huile' },
      Papier: { src: 'papier' },
      Clé: { src: 'cle' },
      Compas: { src: 'compas' },
      Gomme: { src: 'gomme' },
      'Métal en dent de scie': { src: 'metal' },
      Moteur: { src: 'moteur' },
      'Papier vert': { src: 'papier_vert' },
      'Papier noir': { src: 'papier_noir' },
      Agrafeuse: { src: 'agrafeuse' },
      Bazooka: { src: 'bazooka' },
      Bélier: { src: 'belier' },
      Boutons: { src: 'boutons' },
      'Photo de Pierre-Siméon': { src: 'bully_photo' },
      'Image incomplète': { src: 'bully_photo_draw' },
      'Un super réparateur': { src: 'carglass_repare' },
      Chemise: { src: 'chemise' },
      'Chewing-gum': { src: 'chewing_gum' },
      'Le coupable idéal': { src: 'coupable_ideal' },
      'Gomme vache': { src: 'gomme_vache' },
      Goûter: { src: 'gouter' },
      'Goûter empoisonné': { src: 'gouter_empoisonne' },
      'Kit de crochetage': { src: 'kit_crochetage' },
      'Un masque, mais blanc': { src: 'masque_blanc' },
      'Masque de voleur': { src: 'masque_voleur' },
      'Méga glue de la mort qui tue': { src: 'mega_glue' },
      'Photo de classe': { src: 'photo_de_classe' },
      Poupée: { src: 'poupee_boutons' },
      'Poupée Vaudou': { src: 'poupee_aiguille' },
      'Poupée sans yeux': { src: 'poupee' },
      'Pub Carglass': { src: 'pub' },
      Sarbacane: { src: 'sarbacane' },
      Scotch: { src: 'scotch' },
      'Super glue': { src: 'super_glue' },
      Antisèche: { src: 'antiseche' },
      'Papier en forme de billets': { src: 'billet_blanc' },
      'Faux billets': { src: 'billet_vert' },
      Bouteille: { src: 'bouteille' },
      Cartable: { src: 'cartable' },
      Fusée: { src: 'fusee' },
      Malette: { src: 'malette' },
      'Malette de billets': { src: 'malette_argent' },
      'Manuel de cours': { src: 'manuel_cours' },
      'Satellite espion': { src: 'satellite' },
      'Super-héros': { src: 'super_heros' },
      'Ballon perché': { src: 'niv1' },
      'Infiltration au CDI': { src: 'niv2' },
      'Révolte contre le caïd': { src: 'niv3' },
      'Un fâcheux incident': { src: 'niv4' },
      'Le contrôle': { src: 'niv5' },
      Épée: { src: 'epee' },
      'Épée cassée': { src: 'epee_cassee' }
    };

    function getImageDataFromName(name) {
        const data = imagesData[name] || { src: "" };
        const src = data["src"];
        return { name, src };
    }

    class FlowScene {
      constructor (name) {
        this.name = name;
      }
      transitionToLevelSelection () {
        throw Error('Not implemented')
      }
      transitionToSettings () {
        throw Error('Not implemented')
      }
      transitionToAchievements () {
        throw Error('Not implemented')
      }
      transitionToHome () {
        throw Error('Not implemented')
      }
      transitionToGame () {
        throw Error('Not implemented')
      }
      transitionToAbout() {
        document.body.style.backgroundImage = 'url(img/fond.png)';
        flowScene.set(new About$1());
      }
    }
    class Home$1 extends FlowScene {
      constructor () {
        super('home');
      }
      transitionToLevelSelection () {
        document.body.style.backgroundImage = 'url(img/fond.png)';
        flowScene.set(new LevelSelection$1());
      }
      transitionToSettings () {
        document.body.style.backgroundImage = 'url(img/fond.png)';
        flowScene.set(new Settings$1());
      }
      transitionToAchievements () {
        flowScene.set(new Achievements$1());
      }
      transitionToHome () {
        document.body.style.backgroundImage = 'url(img/fond.png)';
        return
      }
    }

    class About$1 extends FlowScene {
      constructor () {
        super('about');
      }
      transitionToLevelSelection () {
        document.body.style.backgroundImage = 'url(img/fond.png)';
        return
      }
      transitionToSettings () {
        return
      }
      transitionToAchievements () {
        return
      }
      transitionToHome () {
        document.body.style.backgroundImage = 'url(img/fond.png)';
        flowScene.set(new Home$1());
      }
    }

    class LevelSelection$1 extends FlowScene {
      constructor () {
        super('levelSelection');
      }
      transitionToHome () {
        flowScene.set(new Home$1());
        document.body.style.backgroundImage = 'url(img/fond.png)';
      }
      transitionToLevelSelection () {
        document.body.style.backgroundImage = 'url(img/fond.png)';
        return
      }
      transitionToGame (level) {
        let img = getImageDataFromName(level).src;
        console.log('Transition to level ' + level);
        document.body.style.backgroundImage = 'url(img/' + img + '.png)';
        flowScene.set(new GameFlow$1(level));
      }
    }

    class Settings$1 extends FlowScene {
      constructor () {
        super('settings');
      }
      transitionToHome () {
        document.body.style.backgroundImage = 'url(img/fond.png)';
        flowScene.set(new Home$1());
      }
      transitionToSettings () {
        return
      }
    }

    class Achievements$1 extends FlowScene {
      constructor () {
        super('achievements');
      }
      transitionToHome () {
        document.body.style.backgroundImage = 'url(img/fond.png)';
        flowScene.set(new Home$1());
      }
      transitionToAchievements () {
        return
      }
    }

    class GameFlow$1 extends FlowScene {
      constructor (levelName) {
        super('gameFlow');
        this.levelName = levelName;
      }
      transitionToHome () {
        flowScene.set(new Home$1());
        document.body.style.backgroundImage = 'url(img/fond.png)';
        console.log('WE NEED TO SAVE HERE !!!');
      }
      transitionToGame () {
        return
      }
      transitionToLevelSelection (completed = false) {
        if (completed) {
          get_store_value(level).end();
          saveProgression();
        }
        document.body.style.backgroundImage = 'url(img/fond.png)';
        flowScene.set(new LevelSelection$1());
      }
    }

    const propToClass = {
        size: (pf, val) => `${pf}-${val}`,
        block: (pf, _val) => `${pf}-block`,
        type: (pf, val) => `${pf}-${val}`,
        outline: (pf, val) => `${pf}-${val}-outline`,
    };
    function omit(obj, properties) {
        return Object.fromEntries(Object.entries(obj)
            .filter(([key, _val]) => !properties.includes(key)));
    }
    function computeClasses(elPrefix, props) {
        return Object.entries(props)
            .filter(([_prop, val]) => val)
            .map(([prop, val]) => propToClass[prop](elPrefix, val))
            .join(' ');
    }
    function getDomAttributes({ props, classes, toOmit = [] }) {
        return {
            ...omit(props, toOmit), class: classes
        };
    }

    /* node_modules\spaper\components\Button.svelte generated by Svelte v3.46.4 */
    const file$h = "node_modules\\spaper\\components\\Button.svelte";

    // (10:0) {:else}
    function create_else_block$3(ctx) {
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[12].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);
    	let button_levels = [/*attr*/ ctx[4], { disabled: /*disabled*/ ctx[0] }];
    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block_1 = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			set_attributes(button, button_data);
    			toggle_class(button, "disabled", /*disabled*/ ctx[0]);
    			add_location(button, file$h, 10, 2, 206);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			if (button.autofocus) button.focus();
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[14], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [
    				dirty & /*attr*/ 16 && /*attr*/ ctx[4],
    				(!current || dirty & /*disabled*/ 1) && { disabled: /*disabled*/ ctx[0] }
    			]));

    			toggle_class(button, "disabled", /*disabled*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(10:0) {:else}",
    		ctx
    	});

    	return block_1;
    }

    // (1:0) {#if isLink || href}
    function create_if_block$a(ctx) {
    	let a;
    	let a_href_value;
    	let a_target_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[12].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);

    	let a_levels = [
    		/*attr*/ ctx[4],
    		{ role: "button" },
    		{
    			href: a_href_value = /*href*/ ctx[2] ?? 'javascript:void(0);'
    		},
    		{
    			target: a_target_value = /*external*/ ctx[3] ? '_blank' : '_self'
    		}
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block_1 = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			toggle_class(a, "disabled", /*disabled*/ ctx[0]);
    			add_location(a, file$h, 1, 2, 23);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*click_handler*/ ctx[13], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				dirty & /*attr*/ 16 && /*attr*/ ctx[4],
    				{ role: "button" },
    				(!current || dirty & /*href*/ 4 && a_href_value !== (a_href_value = /*href*/ ctx[2] ?? 'javascript:void(0);')) && { href: a_href_value },
    				(!current || dirty & /*external*/ 8 && a_target_value !== (a_target_value = /*external*/ ctx[3] ? '_blank' : '_self')) && { target: a_target_value }
    			]));

    			toggle_class(a, "disabled", /*disabled*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(1:0) {#if isLink || href}",
    		ctx
    	});

    	return block_1;
    }

    function create_fragment$i(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$a, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*isLink*/ ctx[1] || /*href*/ ctx[2]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block_1 = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block_1;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	const omit_props_names = ["type","size","block","disabled","outline","isLink","href","external"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, ['default']);
    	var _a;
    	let { type = null } = $$props;
    	let { size = 'default' } = $$props;
    	let { block = false } = $$props;
    	let { disabled = false } = $$props;
    	let { outline = null } = $$props;
    	let { isLink = false } = $$props;
    	let { href = null } = $$props;
    	let { external = false } = $$props;
    	let attr;
    	let classes;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(15, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('type' in $$new_props) $$invalidate(5, type = $$new_props.type);
    		if ('size' in $$new_props) $$invalidate(6, size = $$new_props.size);
    		if ('block' in $$new_props) $$invalidate(7, block = $$new_props.block);
    		if ('disabled' in $$new_props) $$invalidate(0, disabled = $$new_props.disabled);
    		if ('outline' in $$new_props) $$invalidate(8, outline = $$new_props.outline);
    		if ('isLink' in $$new_props) $$invalidate(1, isLink = $$new_props.isLink);
    		if ('href' in $$new_props) $$invalidate(2, href = $$new_props.href);
    		if ('external' in $$new_props) $$invalidate(3, external = $$new_props.external);
    		if ('$$scope' in $$new_props) $$invalidate(11, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		_a,
    		computeClasses,
    		getDomAttributes,
    		type,
    		size,
    		block,
    		disabled,
    		outline,
    		isLink,
    		href,
    		external,
    		attr,
    		classes
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('_a' in $$props) $$invalidate(9, _a = $$new_props._a);
    		if ('type' in $$props) $$invalidate(5, type = $$new_props.type);
    		if ('size' in $$props) $$invalidate(6, size = $$new_props.size);
    		if ('block' in $$props) $$invalidate(7, block = $$new_props.block);
    		if ('disabled' in $$props) $$invalidate(0, disabled = $$new_props.disabled);
    		if ('outline' in $$props) $$invalidate(8, outline = $$new_props.outline);
    		if ('isLink' in $$props) $$invalidate(1, isLink = $$new_props.isLink);
    		if ('href' in $$props) $$invalidate(2, href = $$new_props.href);
    		if ('external' in $$props) $$invalidate(3, external = $$new_props.external);
    		if ('attr' in $$props) $$invalidate(4, attr = $$new_props.attr);
    		if ('classes' in $$props) $$invalidate(10, classes = $$new_props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(10, classes = `paper-btn ${$$invalidate(9, _a = $$restProps.class) !== null && _a !== void 0
		? _a
		: ''} ${computeClasses('btn', { size, block, type, outline })}`);

    		{
    			$$invalidate(4, attr = getDomAttributes({ props: $$restProps, classes }));
    		}
    	};

    	return [
    		disabled,
    		isLink,
    		href,
    		external,
    		attr,
    		type,
    		size,
    		block,
    		outline,
    		_a,
    		classes,
    		$$scope,
    		slots,
    		click_handler,
    		click_handler_1
    	];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {
    			type: 5,
    			size: 6,
    			block: 7,
    			disabled: 0,
    			outline: 8,
    			isLink: 1,
    			href: 2,
    			external: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$i.name
    		});
    	}

    	get type() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get block() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set block(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outline() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outline(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isLink() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isLink(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get external() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set external(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\spaper\components\CloseButton.svelte generated by Svelte v3.46.4 */

    const file$g = "node_modules\\spaper\\components\\CloseButton.svelte";

    function create_fragment$h(ctx) {
    	let button;
    	let t;
    	let button_class_value;
    	let mounted;
    	let dispose;

    	let button_levels = [
    		/*$$restProps*/ ctx[1],
    		{
    			class: button_class_value = "" + ((/*$$restProps*/ ctx[1].class ?? '') + " btn-close")
    		},
    		{ "aria-label": /*ariaLabel*/ ctx[0] }
    	];

    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text("X");
    			set_attributes(button, button_data);
    			toggle_class(button, "svelte-9vtsch", true);
    			add_location(button, file$g, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);
    			if (button.autofocus) button.focus();

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			set_attributes(button, button_data = get_spread_update(button_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				dirty & /*$$restProps*/ 2 && button_class_value !== (button_class_value = "" + ((/*$$restProps*/ ctx[1].class ?? '') + " btn-close")) && { class: button_class_value },
    				dirty & /*ariaLabel*/ 1 && { "aria-label": /*ariaLabel*/ ctx[0] }
    			]));

    			toggle_class(button, "svelte-9vtsch", true);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	const omit_props_names = ["ariaLabel"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CloseButton', slots, []);
    	let { ariaLabel = 'close' } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('ariaLabel' in $$new_props) $$invalidate(0, ariaLabel = $$new_props.ariaLabel);
    	};

    	$$self.$capture_state = () => ({ ariaLabel });

    	$$self.$inject_state = $$new_props => {
    		if ('ariaLabel' in $$props) $$invalidate(0, ariaLabel = $$new_props.ariaLabel);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [ariaLabel, $$restProps, click_handler];
    }

    class CloseButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, { ariaLabel: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CloseButton",
    			options,
    			id: create_fragment$h.name
    		});
    	}

    	get ariaLabel() {
    		throw new Error("<CloseButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaLabel(value) {
    		throw new Error("<CloseButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\spaper\components\Navbar.svelte generated by Svelte v3.46.4 */

    const file$f = "node_modules\\spaper\\components\\Navbar.svelte";
    const get_brand_slot_changes = dirty => ({});
    const get_brand_slot_context = ctx => ({});

    // (5:2) {#if $$slots.brand}
    function create_if_block$9(ctx) {
    	let div;
    	let current;
    	const brand_slot_template = /*#slots*/ ctx[8].brand;
    	const brand_slot = create_slot(brand_slot_template, ctx, /*$$scope*/ ctx[7], get_brand_slot_context);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (brand_slot) brand_slot.c();
    			attr_dev(div, "class", "nav-brand");
    			add_location(div, file$f, 5, 4, 163);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (brand_slot) {
    				brand_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (brand_slot) {
    				if (brand_slot.p && (!current || dirty & /*$$scope*/ 128)) {
    					update_slot_base(
    						brand_slot,
    						brand_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(brand_slot_template, /*$$scope*/ ctx[7], dirty, get_brand_slot_changes),
    						get_brand_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(brand_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(brand_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (brand_slot) brand_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(5:2) {#if $$slots.brand}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let nav;
    	let t0;
    	let div1;
    	let button;
    	let t2;
    	let div0;
    	let nav_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*$$slots*/ ctx[6].brand && create_if_block$9(ctx);
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);

    	let nav_levels = [
    		/*$$restProps*/ ctx[5],
    		{
    			class: nav_class_value = `${/*$$restProps*/ ctx[5].class ?? ''} paper-navbar`
    		}
    	];

    	let nav_data = {};

    	for (let i = 0; i < nav_levels.length; i += 1) {
    		nav_data = assign(nav_data, nav_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			if (if_block) if_block.c();
    			t0 = space();
    			div1 = element("div");
    			button = element("button");
    			button.textContent = "☰";
    			t2 = space();
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(button, "class", "svelte-12pm6a");
    			add_location(button, file$f, 10, 4, 266);
    			attr_dev(div0, "class", "collapsible-body svelte-12pm6a");
    			toggle_class(div0, "open", /*open*/ ctx[3]);
    			add_location(div0, file$f, 11, 4, 309);
    			attr_dev(div1, "class", "collapsible svelte-12pm6a");
    			add_location(div1, file$f, 9, 2, 236);
    			set_attributes(nav, nav_data);
    			toggle_class(nav, "border", /*border*/ ctx[0]);
    			toggle_class(nav, "fixed", /*fixed*/ ctx[1]);
    			toggle_class(nav, "split-nav", /*split*/ ctx[2]);
    			toggle_class(nav, "svelte-12pm6a", true);
    			add_location(nav, file$f, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			if (if_block) if_block.m(nav, null);
    			append_dev(nav, t0);
    			append_dev(nav, div1);
    			append_dev(div1, button);
    			append_dev(div1, t2);
    			append_dev(div1, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*collapse*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$$slots*/ ctx[6].brand) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$$slots*/ 64) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$9(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(nav, t0);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 128)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, null),
    						null
    					);
    				}
    			}

    			if (dirty & /*open*/ 8) {
    				toggle_class(div0, "open", /*open*/ ctx[3]);
    			}

    			set_attributes(nav, nav_data = get_spread_update(nav_levels, [
    				dirty & /*$$restProps*/ 32 && /*$$restProps*/ ctx[5],
    				(!current || dirty & /*$$restProps*/ 32 && nav_class_value !== (nav_class_value = `${/*$$restProps*/ ctx[5].class ?? ''} paper-navbar`)) && { class: nav_class_value }
    			]));

    			toggle_class(nav, "border", /*border*/ ctx[0]);
    			toggle_class(nav, "fixed", /*fixed*/ ctx[1]);
    			toggle_class(nav, "split-nav", /*split*/ ctx[2]);
    			toggle_class(nav, "svelte-12pm6a", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			if (if_block) if_block.d();
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	const omit_props_names = ["border","fixed","split"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Navbar', slots, ['brand','default']);
    	const $$slots = compute_slots(slots);
    	let { border = true } = $$props;
    	let { fixed = false } = $$props;
    	let { split = true } = $$props;
    	let open = false;

    	function collapse() {
    		$$invalidate(3, open = !open);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(5, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('border' in $$new_props) $$invalidate(0, border = $$new_props.border);
    		if ('fixed' in $$new_props) $$invalidate(1, fixed = $$new_props.fixed);
    		if ('split' in $$new_props) $$invalidate(2, split = $$new_props.split);
    		if ('$$scope' in $$new_props) $$invalidate(7, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ border, fixed, split, open, collapse });

    	$$self.$inject_state = $$new_props => {
    		if ('border' in $$props) $$invalidate(0, border = $$new_props.border);
    		if ('fixed' in $$props) $$invalidate(1, fixed = $$new_props.fixed);
    		if ('split' in $$props) $$invalidate(2, split = $$new_props.split);
    		if ('open' in $$props) $$invalidate(3, open = $$new_props.open);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [border, fixed, split, open, collapse, $$restProps, $$slots, $$scope, slots];
    }

    class Navbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, { border: 0, fixed: 1, split: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navbar",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get border() {
    		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set border(value) {
    		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fixed() {
    		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fixed(value) {
    		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get split() {
    		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set split(value) {
    		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\spaper\components\Modal\Modal.svelte generated by Svelte v3.46.4 */
    const file$e = "node_modules\\spaper\\components\\Modal\\Modal.svelte";
    const get_footer_slot_changes$1 = dirty => ({});
    const get_footer_slot_context$1 = ctx => ({});

    // (8:4) {#if title}
    function create_if_block_2$3(ctx) {
    	let h4;
    	let t;

    	const block = {
    		c: function create() {
    			h4 = element("h4");
    			t = text(/*title*/ ctx[1]);
    			attr_dev(h4, "class", "modal-title");
    			add_location(h4, file$e, 8, 6, 218);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);
    			append_dev(h4, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 2) set_data_dev(t, /*title*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(8:4) {#if title}",
    		ctx
    	});

    	return block;
    }

    // (11:4) {#if subTitle}
    function create_if_block_1$5(ctx) {
    	let h5;
    	let t;

    	const block = {
    		c: function create() {
    			h5 = element("h5");
    			t = text(/*subTitle*/ ctx[2]);
    			attr_dev(h5, "class", "modal-subtitle");
    			add_location(h5, file$e, 11, 6, 290);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h5, anchor);
    			append_dev(h5, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*subTitle*/ 4) set_data_dev(t, /*subTitle*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(11:4) {#if subTitle}",
    		ctx
    	});

    	return block;
    }

    // (18:6) {#if $$slots.footer}
    function create_if_block$8(ctx) {
    	let current;
    	const footer_slot_template = /*#slots*/ ctx[8].footer;
    	const footer_slot = create_slot(footer_slot_template, ctx, /*$$scope*/ ctx[9], get_footer_slot_context$1);

    	const block = {
    		c: function create() {
    			if (footer_slot) footer_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (footer_slot) {
    				footer_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (footer_slot) {
    				if (footer_slot.p && (!current || dirty & /*$$scope*/ 512)) {
    					update_slot_base(
    						footer_slot,
    						footer_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(footer_slot_template, /*$$scope*/ ctx[9], dirty, get_footer_slot_changes$1),
    						get_footer_slot_context$1
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(footer_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(footer_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (footer_slot) footer_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(18:6) {#if $$slots.footer}",
    		ctx
    	});

    	return block;
    }

    // (21:6) <Button on:click={close}>
    function create_default_slot$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*closeBtnText*/ ctx[3]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*closeBtnText*/ 8) set_data_dev(t, /*closeBtnText*/ ctx[3]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(21:6) <Button on:click={close}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let div1;
    	let div0;
    	let closebutton;
    	let t0;
    	let t1;
    	let t2;
    	let p;
    	let t3;
    	let footer;
    	let t4;
    	let button;
    	let div1_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	closebutton = new CloseButton({ $$inline: true });
    	closebutton.$on("click", /*close*/ ctx[4]);
    	let if_block0 = /*title*/ ctx[1] && create_if_block_2$3(ctx);
    	let if_block1 = /*subTitle*/ ctx[2] && create_if_block_1$5(ctx);
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], null);
    	let if_block2 = /*$$slots*/ ctx[7].footer && create_if_block$8(ctx);

    	button = new Button({
    			props: {
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*close*/ ctx[4]);

    	let div1_levels = [
    		/*$$restProps*/ ctx[6],
    		{
    			class: div1_class_value = "" + ((/*$$restProps*/ ctx[6].class ?? '') + " modal")
    		}
    	];

    	let div1_data = {};

    	for (let i = 0; i < div1_levels.length; i += 1) {
    		div1_data = assign(div1_data, div1_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(closebutton.$$.fragment);
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			t2 = space();
    			p = element("p");
    			if (default_slot) default_slot.c();
    			t3 = space();
    			footer = element("footer");
    			if (if_block2) if_block2.c();
    			t4 = space();
    			create_component(button.$$.fragment);
    			attr_dev(p, "class", "modal-text");
    			add_location(p, file$e, 13, 4, 347);
    			add_location(footer, file$e, 16, 4, 398);
    			attr_dev(div0, "class", "modal-body svelte-1fqj53");
    			add_location(div0, file$e, 5, 2, 134);
    			set_attributes(div1, div1_data);
    			toggle_class(div1, "active", /*active*/ ctx[0]);
    			toggle_class(div1, "svelte-1fqj53", true);
    			add_location(div1, file$e, 2, 0, 46);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(closebutton, div0, null);
    			append_dev(div0, t0);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div0, t1);
    			if (if_block1) if_block1.m(div0, null);
    			append_dev(div0, t2);
    			append_dev(div0, p);

    			if (default_slot) {
    				default_slot.m(p, null);
    			}

    			append_dev(div0, t3);
    			append_dev(div0, footer);
    			if (if_block2) if_block2.m(footer, null);
    			append_dev(footer, t4);
    			mount_component(button, footer, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window, "keydown", /*handleKeydown*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*title*/ ctx[1]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_2$3(ctx);
    					if_block0.c();
    					if_block0.m(div0, t1);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*subTitle*/ ctx[2]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1$5(ctx);
    					if_block1.c();
    					if_block1.m(div0, t2);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 512)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, null),
    						null
    					);
    				}
    			}

    			if (/*$$slots*/ ctx[7].footer) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty & /*$$slots*/ 128) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block$8(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(footer, t4);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			const button_changes = {};

    			if (dirty & /*$$scope, closeBtnText*/ 520) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);

    			set_attributes(div1, div1_data = get_spread_update(div1_levels, [
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6],
    				(!current || dirty & /*$$restProps*/ 64 && div1_class_value !== (div1_class_value = "" + ((/*$$restProps*/ ctx[6].class ?? '') + " modal"))) && { class: div1_class_value }
    			]));

    			toggle_class(div1, "active", /*active*/ ctx[0]);
    			toggle_class(div1, "svelte-1fqj53", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(closebutton.$$.fragment, local);
    			transition_in(default_slot, local);
    			transition_in(if_block2);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(closebutton.$$.fragment, local);
    			transition_out(default_slot, local);
    			transition_out(if_block2);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(closebutton);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (default_slot) default_slot.d(detaching);
    			if (if_block2) if_block2.d();
    			destroy_component(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	const omit_props_names = ["active","title","subTitle","closeBtnText"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Modal', slots, ['default','footer']);
    	const $$slots = compute_slots(slots);
    	let { active = false } = $$props;
    	let { title = '' } = $$props;
    	let { subTitle = '' } = $$props;
    	let { closeBtnText = 'Close' } = $$props;

    	function close() {
    		$$invalidate(0, active = false);
    	}

    	function handleKeydown({ key }) {
    		if (key === 'Escape') close();
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('active' in $$new_props) $$invalidate(0, active = $$new_props.active);
    		if ('title' in $$new_props) $$invalidate(1, title = $$new_props.title);
    		if ('subTitle' in $$new_props) $$invalidate(2, subTitle = $$new_props.subTitle);
    		if ('closeBtnText' in $$new_props) $$invalidate(3, closeBtnText = $$new_props.closeBtnText);
    		if ('$$scope' in $$new_props) $$invalidate(9, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Button,
    		CloseButton,
    		active,
    		title,
    		subTitle,
    		closeBtnText,
    		close,
    		handleKeydown
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('active' in $$props) $$invalidate(0, active = $$new_props.active);
    		if ('title' in $$props) $$invalidate(1, title = $$new_props.title);
    		if ('subTitle' in $$props) $$invalidate(2, subTitle = $$new_props.subTitle);
    		if ('closeBtnText' in $$props) $$invalidate(3, closeBtnText = $$new_props.closeBtnText);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		active,
    		title,
    		subTitle,
    		closeBtnText,
    		close,
    		handleKeydown,
    		$$restProps,
    		$$slots,
    		slots,
    		$$scope
    	];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {
    			active: 0,
    			title: 1,
    			subTitle: 2,
    			closeBtnText: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get active() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get subTitle() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set subTitle(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeBtnText() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeBtnText(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function open$1(props) {
        const modal = new Modal({
            target: document.body,
            props: { active: true, ...props },
            intro: true
        });
        modal.close = modal.$destroy;
        return modal;
    }
    Modal.open = open$1;

    /* node_modules\spaper\components\Article.svelte generated by Svelte v3.46.4 */

    const file$d = "node_modules\\spaper\\components\\Article.svelte";
    const get_footer_slot_changes = dirty => ({});
    const get_footer_slot_context = ctx => ({});
    const get_textLead_slot_changes = dirty => ({});
    const get_textLead_slot_context = ctx => ({});
    const get_meta_slot_changes = dirty => ({});
    const get_meta_slot_context = ctx => ({});
    const get_title_slot_changes = dirty => ({});
    const get_title_slot_context = ctx => ({});

    // (7:4) {:else}
    function create_else_block_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*title*/ ctx[0]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 1) set_data_dev(t, /*title*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(7:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (5:4) {#if $$slots.title}
    function create_if_block_3$1(ctx) {
    	let current;
    	const title_slot_template = /*#slots*/ ctx[7].title;
    	const title_slot = create_slot(title_slot_template, ctx, /*$$scope*/ ctx[6], get_title_slot_context);

    	const block = {
    		c: function create() {
    			if (title_slot) title_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (title_slot) {
    				title_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (title_slot) {
    				if (title_slot.p && (!current || dirty & /*$$scope*/ 64)) {
    					update_slot_base(
    						title_slot,
    						title_slot_template,
    						ctx,
    						/*$$scope*/ ctx[6],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[6])
    						: get_slot_changes(title_slot_template, /*$$scope*/ ctx[6], dirty, get_title_slot_changes),
    						get_title_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(title_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(title_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (title_slot) title_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(5:4) {#if $$slots.title}",
    		ctx
    	});

    	return block;
    }

    // (14:4) {:else}
    function create_else_block_1$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*meta*/ ctx[1]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*meta*/ 2) set_data_dev(t, /*meta*/ ctx[1]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(14:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (12:4) {#if $$slots.meta}
    function create_if_block_2$2(ctx) {
    	let current;
    	const meta_slot_template = /*#slots*/ ctx[7].meta;
    	const meta_slot = create_slot(meta_slot_template, ctx, /*$$scope*/ ctx[6], get_meta_slot_context);

    	const block = {
    		c: function create() {
    			if (meta_slot) meta_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (meta_slot) {
    				meta_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (meta_slot) {
    				if (meta_slot.p && (!current || dirty & /*$$scope*/ 64)) {
    					update_slot_base(
    						meta_slot,
    						meta_slot_template,
    						ctx,
    						/*$$scope*/ ctx[6],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[6])
    						: get_slot_changes(meta_slot_template, /*$$scope*/ ctx[6], dirty, get_meta_slot_changes),
    						get_meta_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(meta_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(meta_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (meta_slot) meta_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(12:4) {#if $$slots.meta}",
    		ctx
    	});

    	return block;
    }

    // (21:4) {:else}
    function create_else_block$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*textLead*/ ctx[2]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*textLead*/ 4) set_data_dev(t, /*textLead*/ ctx[2]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(21:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (19:4) {#if $$slots.textLead}
    function create_if_block_1$4(ctx) {
    	let current;
    	const textLead_slot_template = /*#slots*/ ctx[7].textLead;
    	const textLead_slot = create_slot(textLead_slot_template, ctx, /*$$scope*/ ctx[6], get_textLead_slot_context);

    	const block = {
    		c: function create() {
    			if (textLead_slot) textLead_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (textLead_slot) {
    				textLead_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (textLead_slot) {
    				if (textLead_slot.p && (!current || dirty & /*$$scope*/ 64)) {
    					update_slot_base(
    						textLead_slot,
    						textLead_slot_template,
    						ctx,
    						/*$$scope*/ ctx[6],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[6])
    						: get_slot_changes(textLead_slot_template, /*$$scope*/ ctx[6], dirty, get_textLead_slot_changes),
    						get_textLead_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(textLead_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(textLead_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (textLead_slot) textLead_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(19:4) {#if $$slots.textLead}",
    		ctx
    	});

    	return block;
    }

    // (28:2) {#if $$slots.footer}
    function create_if_block$7(ctx) {
    	let footer;
    	let current;
    	const footer_slot_template = /*#slots*/ ctx[7].footer;
    	const footer_slot = create_slot(footer_slot_template, ctx, /*$$scope*/ ctx[6], get_footer_slot_context);

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			if (footer_slot) footer_slot.c();
    			attr_dev(footer, "class", "row");
    			add_location(footer, file$d, 28, 4, 533);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);

    			if (footer_slot) {
    				footer_slot.m(footer, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (footer_slot) {
    				if (footer_slot.p && (!current || dirty & /*$$scope*/ 64)) {
    					update_slot_base(
    						footer_slot,
    						footer_slot_template,
    						ctx,
    						/*$$scope*/ ctx[6],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[6])
    						: get_slot_changes(footer_slot_template, /*$$scope*/ ctx[6], dirty, get_footer_slot_changes),
    						get_footer_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(footer_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(footer_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    			if (footer_slot) footer_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(28:2) {#if $$slots.footer}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let article;
    	let h1;
    	let current_block_type_index;
    	let if_block0;
    	let t0;
    	let p0;
    	let current_block_type_index_1;
    	let if_block1;
    	let t1;
    	let p1;
    	let current_block_type_index_2;
    	let if_block2;
    	let t2;
    	let p2;
    	let t3;
    	let article_class_value;
    	let current;
    	const if_block_creators = [create_if_block_3$1, create_else_block_2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$$slots*/ ctx[5].title) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	const if_block_creators_1 = [create_if_block_2$2, create_else_block_1$1];
    	const if_blocks_1 = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*$$slots*/ ctx[5].meta) return 0;
    		return 1;
    	}

    	current_block_type_index_1 = select_block_type_1(ctx);
    	if_block1 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);
    	const if_block_creators_2 = [create_if_block_1$4, create_else_block$2];
    	const if_blocks_2 = [];

    	function select_block_type_2(ctx, dirty) {
    		if (/*$$slots*/ ctx[5].textLead) return 0;
    		return 1;
    	}

    	current_block_type_index_2 = select_block_type_2(ctx);
    	if_block2 = if_blocks_2[current_block_type_index_2] = if_block_creators_2[current_block_type_index_2](ctx);
    	const default_slot_template = /*#slots*/ ctx[7].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);
    	let if_block3 = /*$$slots*/ ctx[5].footer && create_if_block$7(ctx);

    	let article_levels = [
    		/*$$restProps*/ ctx[4],
    		{
    			class: article_class_value = "" + ((/*$$restProps*/ ctx[4].class ?? '') + " article padding-small")
    		}
    	];

    	let article_data = {};

    	for (let i = 0; i < article_levels.length; i += 1) {
    		article_data = assign(article_data, article_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			article = element("article");
    			h1 = element("h1");
    			if_block0.c();
    			t0 = space();
    			p0 = element("p");
    			if_block1.c();
    			t1 = space();
    			p1 = element("p");
    			if_block2.c();
    			t2 = space();
    			p2 = element("p");
    			if (default_slot) default_slot.c();
    			t3 = space();
    			if (if_block3) if_block3.c();
    			attr_dev(h1, "class", "article-title");
    			add_location(h1, file$d, 3, 2, 116);
    			attr_dev(p0, "class", "article-meta");
    			add_location(p0, file$d, 10, 2, 241);
    			attr_dev(p1, "class", "text-lead");
    			add_location(p1, file$d, 17, 2, 360);
    			add_location(p2, file$d, 25, 2, 489);
    			set_attributes(article, article_data);
    			toggle_class(article, "border", /*border*/ ctx[3]);
    			add_location(article, file$d, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, h1);
    			if_blocks[current_block_type_index].m(h1, null);
    			append_dev(article, t0);
    			append_dev(article, p0);
    			if_blocks_1[current_block_type_index_1].m(p0, null);
    			append_dev(article, t1);
    			append_dev(article, p1);
    			if_blocks_2[current_block_type_index_2].m(p1, null);
    			append_dev(article, t2);
    			append_dev(article, p2);

    			if (default_slot) {
    				default_slot.m(p2, null);
    			}

    			append_dev(article, t3);
    			if (if_block3) if_block3.m(article, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block0 = if_blocks[current_block_type_index];

    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				} else {
    					if_block0.p(ctx, dirty);
    				}

    				transition_in(if_block0, 1);
    				if_block0.m(h1, null);
    			}

    			let previous_block_index_1 = current_block_type_index_1;
    			current_block_type_index_1 = select_block_type_1(ctx);

    			if (current_block_type_index_1 === previous_block_index_1) {
    				if_blocks_1[current_block_type_index_1].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks_1[previous_block_index_1], 1, 1, () => {
    					if_blocks_1[previous_block_index_1] = null;
    				});

    				check_outros();
    				if_block1 = if_blocks_1[current_block_type_index_1];

    				if (!if_block1) {
    					if_block1 = if_blocks_1[current_block_type_index_1] = if_block_creators_1[current_block_type_index_1](ctx);
    					if_block1.c();
    				} else {
    					if_block1.p(ctx, dirty);
    				}

    				transition_in(if_block1, 1);
    				if_block1.m(p0, null);
    			}

    			let previous_block_index_2 = current_block_type_index_2;
    			current_block_type_index_2 = select_block_type_2(ctx);

    			if (current_block_type_index_2 === previous_block_index_2) {
    				if_blocks_2[current_block_type_index_2].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks_2[previous_block_index_2], 1, 1, () => {
    					if_blocks_2[previous_block_index_2] = null;
    				});

    				check_outros();
    				if_block2 = if_blocks_2[current_block_type_index_2];

    				if (!if_block2) {
    					if_block2 = if_blocks_2[current_block_type_index_2] = if_block_creators_2[current_block_type_index_2](ctx);
    					if_block2.c();
    				} else {
    					if_block2.p(ctx, dirty);
    				}

    				transition_in(if_block2, 1);
    				if_block2.m(p1, null);
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 64)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[6],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[6])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[6], dirty, null),
    						null
    					);
    				}
    			}

    			if (/*$$slots*/ ctx[5].footer) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);

    					if (dirty & /*$$slots*/ 32) {
    						transition_in(if_block3, 1);
    					}
    				} else {
    					if_block3 = create_if_block$7(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(article, null);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}

    			set_attributes(article, article_data = get_spread_update(article_levels, [
    				dirty & /*$$restProps*/ 16 && /*$$restProps*/ ctx[4],
    				(!current || dirty & /*$$restProps*/ 16 && article_class_value !== (article_class_value = "" + ((/*$$restProps*/ ctx[4].class ?? '') + " article padding-small"))) && { class: article_class_value }
    			]));

    			toggle_class(article, "border", /*border*/ ctx[3]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			transition_in(default_slot, local);
    			transition_in(if_block3);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			transition_out(default_slot, local);
    			transition_out(if_block3);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    			if_blocks[current_block_type_index].d();
    			if_blocks_1[current_block_type_index_1].d();
    			if_blocks_2[current_block_type_index_2].d();
    			if (default_slot) default_slot.d(detaching);
    			if (if_block3) if_block3.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	const omit_props_names = ["title","meta","textLead","border"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Article', slots, ['title','meta','textLead','default','footer']);
    	const $$slots = compute_slots(slots);
    	let { title = '' } = $$props;
    	let { meta = '' } = $$props;
    	let { textLead = '' } = $$props;
    	let { border = false } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(4, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('title' in $$new_props) $$invalidate(0, title = $$new_props.title);
    		if ('meta' in $$new_props) $$invalidate(1, meta = $$new_props.meta);
    		if ('textLead' in $$new_props) $$invalidate(2, textLead = $$new_props.textLead);
    		if ('border' in $$new_props) $$invalidate(3, border = $$new_props.border);
    		if ('$$scope' in $$new_props) $$invalidate(6, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ title, meta, textLead, border });

    	$$self.$inject_state = $$new_props => {
    		if ('title' in $$props) $$invalidate(0, title = $$new_props.title);
    		if ('meta' in $$props) $$invalidate(1, meta = $$new_props.meta);
    		if ('textLead' in $$props) $$invalidate(2, textLead = $$new_props.textLead);
    		if ('border' in $$props) $$invalidate(3, border = $$new_props.border);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, meta, textLead, border, $$restProps, $$slots, $$scope, slots];
    }

    class Article extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {
    			title: 0,
    			meta: 1,
    			textLead: 2,
    			border: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Article",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get title() {
    		throw new Error("<Article>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Article>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get meta() {
    		throw new Error("<Article>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set meta(value) {
    		throw new Error("<Article>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get textLead() {
    		throw new Error("<Article>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set textLead(value) {
    		throw new Error("<Article>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get border() {
    		throw new Error("<Article>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set border(value) {
    		throw new Error("<Article>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }
    function scale(node, { delay = 0, duration = 400, easing = cubicOut, start = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const sd = 1 - start;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (_t, u) => `
			transform: ${transform} scale(${1 - (sd * u)});
			opacity: ${target_opacity - (od * u)}
		`
        };
    }

    /* node_modules\spaper\components\Toast\ToastContainer.svelte generated by Svelte v3.46.4 */

    const file$c = "node_modules\\spaper\\components\\Toast\\ToastContainer.svelte";

    function create_fragment$d(ctx) {
    	let div;
    	let div_class_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", div_class_value = "" + (containerClass + " " + /*position*/ ctx[0] + " svelte-1biuxv2"));
    			add_location(div, file$c, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*position*/ 1 && div_class_value !== (div_class_value = "" + (containerClass + " " + /*position*/ ctx[0] + " svelte-1biuxv2"))) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const containerClass = 'paper-toast-container';

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ToastContainer', slots, []);
    	let { position = 'top-right' } = $$props;
    	const writable_props = ['position'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ToastContainer> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('position' in $$props) $$invalidate(0, position = $$props.position);
    	};

    	$$self.$capture_state = () => ({ containerClass, position });

    	$$self.$inject_state = $$props => {
    		if ('position' in $$props) $$invalidate(0, position = $$props.position);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [position];
    }

    class ToastContainer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { position: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ToastContainer",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get position() {
    		throw new Error("<ToastContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set position(value) {
    		throw new Error("<ToastContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\spaper\components\Toast\Toast.svelte generated by Svelte v3.46.4 */
    const file$b = "node_modules\\spaper\\components\\Toast\\Toast.svelte";

    // (1:0) {#if active}
    function create_if_block$6(ctx) {
    	let div;
    	let html_tag;
    	let t;
    	let div_class_value;
    	let div_intro;
    	let div_outro;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = (/*dismissible*/ ctx[2] || /*indefinite*/ ctx[3]) && create_if_block_1$3(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			html_tag = new HtmlTag();
    			t = space();
    			if (if_block) if_block.c();
    			html_tag.a = t;
    			attr_dev(div, "class", div_class_value = "" + (null_to_empty(/*classes*/ ctx[7]) + " svelte-18aojlw"));
    			attr_dev(div, "role", "alert");
    			add_location(div, file$b, 1, 2, 15);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			html_tag.m(/*message*/ ctx[0], div);
    			append_dev(div, t);
    			if (if_block) if_block.m(div, null);
    			/*div_binding*/ ctx[15](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "mouseenter", /*pause*/ ctx[8], false, false, false),
    					listen_dev(div, "mouseleave", /*dismiss*/ ctx[9], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (!current || dirty & /*message*/ 1) html_tag.p(/*message*/ ctx[0]);

    			if (/*dismissible*/ ctx[2] || /*indefinite*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*dismissible, indefinite*/ 12) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*classes*/ 128 && div_class_value !== (div_class_value = "" + (null_to_empty(/*classes*/ ctx[7]) + " svelte-18aojlw"))) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);

    			add_render_callback(() => {
    				if (div_outro) div_outro.end(1);

    				div_intro = create_in_transition(div, fly, {
    					y: /*position*/ ctx[1].includes('top') ? -100 : 100
    				});

    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			if (div_intro) div_intro.invalidate();
    			div_outro = create_out_transition(div, fade, { duration: TRANSITION_OUT_DURATION });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			/*div_binding*/ ctx[15](null);
    			if (detaching && div_outro) div_outro.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(1:0) {#if active}",
    		ctx
    	});

    	return block;
    }

    // (10:4) {#if dismissible||indefinite}
    function create_if_block_1$3(ctx) {
    	let closebutton;
    	let current;

    	closebutton = new CloseButton({
    			props: { ariaLabel: /*closeAriaLabel*/ ctx[4] },
    			$$inline: true
    		});

    	closebutton.$on("click", /*close*/ ctx[10]);

    	const block = {
    		c: function create() {
    			create_component(closebutton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(closebutton, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const closebutton_changes = {};
    			if (dirty & /*closeAriaLabel*/ 16) closebutton_changes.ariaLabel = /*closeAriaLabel*/ ctx[4];
    			closebutton.$set(closebutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(closebutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(closebutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(closebutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(10:4) {#if dismissible||indefinite}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*active*/ ctx[5] && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*active*/ ctx[5]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*active*/ 32) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$6(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const TRANSITION_OUT_DURATION = 300;

    function instance$c($$self, $$props, $$invalidate) {
    	let containerSelector;
    	let classes;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Toast', slots, []);
    	let { message } = $$props;
    	let { type = 'primary' } = $$props;
    	let { duration = 2000 } = $$props;
    	let { position = 'top-right' } = $$props;
    	let { pauseOnHover = false } = $$props;
    	let { dismissible = false } = $$props;
    	let { indefinite = false } = $$props;
    	let { closeAriaLabel = 'close' } = $$props;
    	let { onClose = null } = $$props;
    	let active = true;
    	let toastElement;
    	let timeoutId;

    	onMount(() => {
    		insert();

    		if (!indefinite) {
    			timeoutId = window.setTimeout(close, duration);
    		}

    		if (timeoutId) {
    			return () => clearTimeout(timeoutId);
    		}
    	});

    	function pause() {
    		if (!pauseOnHover || indefinite) return;
    		clearTimeout(timeoutId);
    	}

    	function dismiss() {
    		if (!pauseOnHover || indefinite) return;
    		close();
    	}

    	function close() {
    		$$invalidate(5, active = false);
    		removeContainer();

    		onClose === null || onClose === void 0
    		? void 0
    		: onClose();
    	}

    	function getContainer() {
    		return document.querySelector(containerSelector);
    	}

    	function setupContainer() {
    		new ToastContainer({
    				target: document.body,
    				props: { position }
    			});

    		return getContainer();
    	}

    	function insert() {
    		const container = getContainer() || setupContainer();
    		container.insertAdjacentElement('afterbegin', toastElement);
    	}

    	function removeContainer() {
    		const container = getContainer();

    		setTimeout(
    			() => {
    				if (container.children.length === 1) {
    					container.remove();
    				}
    			},
    			TRANSITION_OUT_DURATION
    		);
    	}

    	const writable_props = [
    		'message',
    		'type',
    		'duration',
    		'position',
    		'pauseOnHover',
    		'dismissible',
    		'indefinite',
    		'closeAriaLabel',
    		'onClose'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Toast> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			toastElement = $$value;
    			$$invalidate(6, toastElement);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('message' in $$props) $$invalidate(0, message = $$props.message);
    		if ('type' in $$props) $$invalidate(11, type = $$props.type);
    		if ('duration' in $$props) $$invalidate(12, duration = $$props.duration);
    		if ('position' in $$props) $$invalidate(1, position = $$props.position);
    		if ('pauseOnHover' in $$props) $$invalidate(13, pauseOnHover = $$props.pauseOnHover);
    		if ('dismissible' in $$props) $$invalidate(2, dismissible = $$props.dismissible);
    		if ('indefinite' in $$props) $$invalidate(3, indefinite = $$props.indefinite);
    		if ('closeAriaLabel' in $$props) $$invalidate(4, closeAriaLabel = $$props.closeAriaLabel);
    		if ('onClose' in $$props) $$invalidate(14, onClose = $$props.onClose);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		fly,
    		fade,
    		computeClasses,
    		ToastContainer,
    		containerClass,
    		CloseButton,
    		message,
    		type,
    		duration,
    		position,
    		pauseOnHover,
    		dismissible,
    		indefinite,
    		closeAriaLabel,
    		onClose,
    		TRANSITION_OUT_DURATION,
    		active,
    		toastElement,
    		timeoutId,
    		pause,
    		dismiss,
    		close,
    		getContainer,
    		setupContainer,
    		insert,
    		removeContainer,
    		containerSelector,
    		classes
    	});

    	$$self.$inject_state = $$props => {
    		if ('message' in $$props) $$invalidate(0, message = $$props.message);
    		if ('type' in $$props) $$invalidate(11, type = $$props.type);
    		if ('duration' in $$props) $$invalidate(12, duration = $$props.duration);
    		if ('position' in $$props) $$invalidate(1, position = $$props.position);
    		if ('pauseOnHover' in $$props) $$invalidate(13, pauseOnHover = $$props.pauseOnHover);
    		if ('dismissible' in $$props) $$invalidate(2, dismissible = $$props.dismissible);
    		if ('indefinite' in $$props) $$invalidate(3, indefinite = $$props.indefinite);
    		if ('closeAriaLabel' in $$props) $$invalidate(4, closeAriaLabel = $$props.closeAriaLabel);
    		if ('onClose' in $$props) $$invalidate(14, onClose = $$props.onClose);
    		if ('active' in $$props) $$invalidate(5, active = $$props.active);
    		if ('toastElement' in $$props) $$invalidate(6, toastElement = $$props.toastElement);
    		if ('timeoutId' in $$props) timeoutId = $$props.timeoutId;
    		if ('containerSelector' in $$props) containerSelector = $$props.containerSelector;
    		if ('classes' in $$props) $$invalidate(7, classes = $$props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*position*/ 2) {
    			containerSelector = `.${containerClass}.${position}`;
    		}

    		if ($$self.$$.dirty & /*type*/ 2048) {
    			$$invalidate(7, classes = `alert margin-small shadow ${computeClasses('alert', { type })}`);
    		}
    	};

    	return [
    		message,
    		position,
    		dismissible,
    		indefinite,
    		closeAriaLabel,
    		active,
    		toastElement,
    		classes,
    		pause,
    		dismiss,
    		close,
    		type,
    		duration,
    		pauseOnHover,
    		onClose,
    		div_binding
    	];
    }

    class Toast extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {
    			message: 0,
    			type: 11,
    			duration: 12,
    			position: 1,
    			pauseOnHover: 13,
    			dismissible: 2,
    			indefinite: 3,
    			closeAriaLabel: 4,
    			onClose: 14
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Toast",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*message*/ ctx[0] === undefined && !('message' in props)) {
    			console.warn("<Toast> was created without expected prop 'message'");
    		}
    	}

    	get message() {
    		throw new Error("<Toast>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set message(value) {
    		throw new Error("<Toast>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<Toast>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Toast>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<Toast>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<Toast>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get position() {
    		throw new Error("<Toast>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set position(value) {
    		throw new Error("<Toast>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pauseOnHover() {
    		throw new Error("<Toast>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pauseOnHover(value) {
    		throw new Error("<Toast>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dismissible() {
    		throw new Error("<Toast>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dismissible(value) {
    		throw new Error("<Toast>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get indefinite() {
    		throw new Error("<Toast>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set indefinite(value) {
    		throw new Error("<Toast>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeAriaLabel() {
    		throw new Error("<Toast>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeAriaLabel(value) {
    		throw new Error("<Toast>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onClose() {
    		throw new Error("<Toast>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onClose(value) {
    		throw new Error("<Toast>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function open(props) {
        if (typeof props === 'string')
            props = { message: props };
        new Toast({
            target: document.body,
            props,
            intro: true,
        });
    }
    function openType(type) {
        return (options) => {
            const props = {
                type,
                message: '',
            };
            if (typeof options === 'string')
                props.message = options;
            else
                Object.assign(props, options);
            new Toast({
                target: document.body,
                props,
                intro: true,
            });
        };
    }
    const info = openType('secondary');
    const success = openType('success');
    const warning = openType('warning');
    const warn = warning;
    const danger = openType('danger');
    const error = danger;
    Object.assign(Toast, {
        open, info, success, warning, warn, error, danger
    });

    /* src\Home.svelte generated by Svelte v3.46.4 */
    const file$a = "src\\Home.svelte";

    // (9:8) <Button on:click={$flowScene.transitionToLevelSelection()}>
    function create_default_slot_1$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Jouer");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(9:8) <Button on:click={$flowScene.transitionToLevelSelection()}>",
    		ctx
    	});

    	return block;
    }

    // (7:4) <Article title={$gameName} border>
    function create_default_slot$3(ctx) {
    	let html_tag;
    	let t;
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", function () {
    		if (is_function(/*$flowScene*/ ctx[2].transitionToLevelSelection())) /*$flowScene*/ ctx[2].transitionToLevelSelection().apply(this, arguments);
    	});

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag();
    			t = space();
    			create_component(button.$$.fragment);
    			html_tag.a = t;
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(/*$introText*/ ctx[1], target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (!current || dirty & /*$introText*/ 2) html_tag.p(/*$introText*/ ctx[1]);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) html_tag.d();
    			if (detaching) detach_dev(t);
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(7:4) <Article title={$gameName} border>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let div2;
    	let article;
    	let t0;
    	let br;
    	let t1;
    	let div1;
    	let div0;
    	let button0;
    	let t3;
    	let img;
    	let img_src_value;
    	let t4;
    	let button1;
    	let current;
    	let mounted;
    	let dispose;

    	article = new Article({
    			props: {
    				title: /*$gameName*/ ctx[0],
    				border: true,
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			create_component(article.$$.fragment);
    			t0 = space();
    			br = element("br");
    			t1 = space();
    			div1 = element("div");
    			div0 = element("div");
    			button0 = element("button");
    			button0.textContent = "Succès";
    			t3 = space();
    			img = element("img");
    			t4 = space();
    			button1 = element("button");
    			button1.textContent = "Paramètres";
    			add_location(br, file$a, 11, 4, 322);
    			add_location(button0, file$a, 14, 6, 370);
    			attr_dev(img, "class", "logo");
    			if (!src_url_equal(img.src, img_src_value = "../img/logo_pkc.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "logo_team");
    			add_location(img, file$a, 15, 6, 450);
    			add_location(button1, file$a, 17, 6, 526);
    			attr_dev(div0, "class", "footer");
    			add_location(div0, file$a, 13, 4, 342);
    			add_location(div1, file$a, 12, 2, 331);
    			attr_dev(div2, "class", "main");
    			add_location(div2, file$a, 5, 0, 129);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			mount_component(article, div2, null);
    			append_dev(div2, t0);
    			append_dev(div2, br);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, button0);
    			append_dev(div0, t3);
    			append_dev(div0, img);
    			append_dev(div0, t4);
    			append_dev(div0, button1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						button0,
    						"click",
    						function () {
    							if (is_function(/*$flowScene*/ ctx[2].transitionToAchievements())) /*$flowScene*/ ctx[2].transitionToAchievements().apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(
    						button1,
    						"click",
    						function () {
    							if (is_function(/*$flowScene*/ ctx[2].transitionToSettings())) /*$flowScene*/ ctx[2].transitionToSettings().apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			const article_changes = {};
    			if (dirty & /*$gameName*/ 1) article_changes.title = /*$gameName*/ ctx[0];

    			if (dirty & /*$$scope, $flowScene, $introText*/ 14) {
    				article_changes.$$scope = { dirty, ctx };
    			}

    			article.$set(article_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(article.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(article.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(article);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let $gameName;
    	let $introText;
    	let $flowScene;
    	validate_store(gameName, 'gameName');
    	component_subscribe($$self, gameName, $$value => $$invalidate(0, $gameName = $$value));
    	validate_store(introText, 'introText');
    	component_subscribe($$self, introText, $$value => $$invalidate(1, $introText = $$value));
    	validate_store(flowScene, 'flowScene');
    	component_subscribe($$self, flowScene, $$value => $$invalidate(2, $flowScene = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		gameName,
    		flowScene,
    		introText,
    		Article,
    		Button,
    		$gameName,
    		$introText,
    		$flowScene
    	});

    	return [$gameName, $introText, $flowScene];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    /* src\About.svelte generated by Svelte v3.46.4 */

    const { console: console_1 } = globals;
    const file$9 = "src\\About.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i].name;
    	child_ctx[2] = list[i].website;
    	return child_ctx;
    }

    // (25:10) {:else}
    function create_else_block$1(ctx) {
    	let t_value = /*name*/ ctx[1] + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(25:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (23:10) {#if website != "#"}
    function create_if_block$5(ctx) {
    	let a;
    	let t_value = /*name*/ ctx[1] + "";
    	let t;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "href", /*website*/ ctx[2]);
    			add_location(a, file$9, 23, 12, 881);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(23:10) {#if website != \\\"#\\\"}",
    		ctx
    	});

    	return block;
    }

    // (21:6) {#each about as { name, website }}
    function create_each_block$4(ctx) {
    	let li;
    	let t;

    	function select_block_type(ctx, dirty) {
    		if (/*website*/ ctx[2] != "#") return create_if_block$5;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			li = element("li");
    			if_block.c();
    			t = space();
    			add_location(li, file$9, 21, 8, 831);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			if_block.m(li, null);
    			append_dev(li, t);
    		},
    		p: function update(ctx, dirty) {
    			if_block.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(21:6) {#each about as { name, website }}",
    		ctx
    	});

    	return block;
    }

    // (19:2) <Article title={"Les alchimistes :"} border>
    function create_default_slot$2(ctx) {
    	let ul;
    	let each_value = /*about*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(ul, file$9, 19, 4, 775);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*about*/ 1) {
    				each_value = /*about*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(19:2) <Article title={\\\"Les alchimistes :\\\"} border>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div;
    	let article;
    	let t;
    	let br;
    	let current;

    	article = new Article({
    			props: {
    				title: "Les alchimistes :",
    				border: true,
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(article.$$.fragment);
    			t = space();
    			br = element("br");
    			add_location(br, file$9, 32, 2, 1042);
    			attr_dev(div, "class", "main");
    			add_location(div, file$9, 17, 0, 703);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(article, div, null);
    			append_dev(div, t);
    			append_dev(div, br);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const article_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				article_changes.$$scope = { dirty, ctx };
    			}

    			article.$set(article_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(article.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(article.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(article);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('About', slots, []);

    	let about = [
    		{
    			name: 'Jules',
    			website: 'https://julesfouchy.github.io/home/'
    		},
    		{ name: 'Anaïs', website: '#' },
    		{
    			name: 'Clémence',
    			website: 'https://www.instagram.com/poulpillow/'
    		},
    		{
    			name: 'Lilou',
    			website: 'https://www.instagram.com/miss_bidule/'
    		},
    		{ name: 'Amalia', website: '#' },
    		{
    			name: 'Enguerrand',
    			website: 'https://www.instagram.com/enguerrand_desmet/'
    		},
    		{
    			name: 'Emma',
    			website: 'https://emmapernin.fr/'
    		},
    		{
    			name: 'Aurore',
    			website: 'https://www.instagram.com/_just_kiel_/'
    		}
    	];

    	console.log(about);
    	shuffleArray(about);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<About> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Article, shuffleArray, about });

    	$$self.$inject_state = $$props => {
    		if ('about' in $$props) $$invalidate(0, about = $$props.about);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [about];
    }

    class About extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    var levels = {
      'Ballon perché': {
        name: 'Ballon perché',
        startingItems: [
          'Tissu',
          'Crayons de couleur',
          'Briquet',
          'Ciseaux',
          'Tournesol',
          'Taille-crayon',
          'Colle',
          'Terre',
          'Stylo',
          'Pétards'
        ],
        recipes: [
          { input: ['Stylo', 'Colle'], output: ['Échelle'] },
          {
            input: ['Costume de super-héros', 'Poudre de perlinpinpin'],
            output: ['Super-héros']
          },
          {
            input: ['Tissu', 'Crayons de couleur'],
            output: ['Costume de super-héros']
          },
          { input: ['Pétards', 'Terre'], output: ['Poudre de perlinpinpin'] },
          {
            input: ['Tôle', 'Ciseaux'],
            output: ['Métal en dent de scie']
          },
          {
            input: ['Métal en dent de scie', 'Moteur'],
            output: ['Tronçonneuse sans huile']
          },
          {
            input: ['Tronçonneuse sans huile', 'Huile de tournesol'],
            output: ['Tronçonneuse']
          },
          { input: ['Taille-crayon', 'Briquet'], output: ['Tôle'] },
          { input: ['Tôle', 'Briquet'], output: ['Moteur'] },
          { input: ['Tournesol'], output: ['Huile de tournesol'] },
          { input: ['Ciseaux', 'Pétards'], output: ['Épée'] },
          { input: ['Épée', 'Pétards'], output: ['Épée cassée'] }
        ],
        easySolution: 'Échelle',
        expertSolution: 'Super-héros',
        failSolution: 'Tronçonneuse',
        dialogsBegin: [
          "Oh non j'ai coincé mon ballon dans l'arbre ! Mais que faire ! Fichtre ! Cornebidouille ! Me voilà bien dans l'embarras 😳",
          "Ah, comment est-ce que je vais bien pouvoir me débrouiller avec ce que j'ai sous la main ?"
        ],
        dialogsEasySolution: [
          "Ouhla elle est pas très stable cette échelle ! Enfin j'ai réussi à récupérer mon ballon c'est l'essentiel !",
          "Mais je me demande quand même si je n'aurais pas pu faire autrement..."
        ],
        dialogsExpertSolution: [
          "Par le pouvoir de perlinpinpin ! Je décolle ! Récupérer ce ballon a été un jeu d'enfant ! 🦸"
        ],
        dialogsFail: [
          "<i>L'arbre tombe sur votre petit crâne.</i>",
          "Oups, je comprends maintenant pourquoi on ne m'a jamais laissé me servir de la tronçonneuse à la maison 😳"
        ],
        objective: "Récuperer le ballon coincé dans l'arbre."
      },
      'Infiltration au CDI': {
        name: 'Infiltration au CDI',
        startingItems: [
          'Taille-crayon',
          'Briquet',
          'Ciseaux',
          'Gomme',
          'Stylo',
          'Compas',
          'Papier',
          'Crayons de couleur'
        ],
        recipes: [
          { input: ['Taille-crayon', 'Briquet'], output: ['Tôle'] },
          { input: ['Tôle', 'Ciseaux'], output: ['Clé'] },
          { input: ['Crayons de couleur', 'Gomme'], output: ['Gomme vache'] },
          { input: ['Gomme vache', 'Stylo'], output: ['Bélier'] },
          { input: ['Masque de voleur', 'Compas'], output: ['Kit de crochetage'] },
          { input: ['Papier', 'Crayons de couleur'], output: ['Papier noir'] },
          { input: ['Papier noir', 'Ciseaux'], output: ['Masque de voleur'] },
          { input: ['Papier', 'Ciseaux'], output: ['Un masque, mais blanc'] },
          {
            input: ['Un masque, mais blanc', 'Crayons de couleur'],
            output: ['Masque de voleur']
          }
        ],
        easySolution: 'Clé',
        expertSolution: 'Kit de crochetage',
        failSolution: 'Bélier',
        dialogsBegin: [
          "Et si j'allais jouer à Dofus ? Le CDI est fermé à cette heure là mais ce n'est pas un problème pour moi !",
          'Comment vais-je bien pouvoir ouvrir cette porte ?'
        ],
        dialogsEasySolution: [
          'Wow je viens de hack-clé le CDI ! Wouhou ! À moi les kamas !'
        ],
        dialogsExpertSolution: ['Ni vu ni connu ! Aucune porte ne me résiste !'],
        dialogsFail: [
          'Bêêêêêêêh',
          'Oww, le bélier était en fait une chèvre 🐐',
          "C'est mignon mais ce n'est pas avec ça qu'on va ouvrir la porte ! Dommage, je suppose que jouer avec la chèvre c'est bien aussi."
        ],
        objective: 'Ouvrir la porte du CDI.'
      },
      'Révolte contre le caïd': {
        name: 'Révolte contre le caïd',
        startingItems: [
          'Stylo',
          'Ciseaux',
          'Pétards',
          'Compas',
          'Chemise',
          'Agrafeuse',
          'Goûter',
          'Terre'
        ],
        recipes: [
          { input: ['Goûter', 'Terre'], output: ['Goûter empoisonné'] },
          { input: ['Stylo', 'Ciseaux'], output: ['Sarbacane'] },
          { input: ['Sarbacane', 'Pétards'], output: ['Bazooka'] },
          { input: ['Chemise', 'Ciseaux'], output: ['Boutons', 'Tissu'] },
          { input: ['Agrafeuse', 'Tissu'], output: ['Poupée sans yeux'] },
          { input: ['Poupée sans yeux', 'Boutons'], output: ['Poupée'] },
          { input: ['Poupée', 'Compas'], output: ['Poupée Vaudou'] },
          { input: ['Ciseaux', 'Pétards'], output: ['Épée'] },
          { input: ['Épée', 'Pétards'], output: ['Épée cassée'] }
        ],
        easySolution: 'Goûter empoisonné',
        expertSolution: 'Poupée Vaudou',
        failSolution: 'Bazooka',
        dialogsBegin: [
          "J'en ai marre de me faire tout le temps embêter par Pierre-Siméon, il va voir de quel bois je me chauffe !"
        ],
        dialogsEasySolution: [
          'Héhé, si il me vole encore mon goûter il aura une drôle de surprise !'
        ],
        dialogsExpertSolution: ['Voilà une réponse qui a du piquant 😈'],
        dialogsFail: [
          '<i>KABOOM 💥💥💥</i>',
          'Aouch !',
          '<i>Le pétard vous explose à la figure, il fallait souffler, pas fumer le pétard voyons !</i>'
        ],
        objective: "Se dépatouiller de l'emprise de Pierre-Siméon."
      },
      'Un fâcheux incident': {
        name: 'Un fâcheux incident',
        startingItems: [
          'Scotch',
          'Colle',
          'Chewing-gum',
          'Photo de classe',
          'Ciseaux',
          'Papier',
          'Crayons de couleur',
          'Téléphone'
        ],
        recipes: [
          { input: ['Scotch', 'Colle'], output: ['Super glue'] },
          {
            input: ['Super glue', 'Chewing-gum'],
            output: ['Méga glue de la mort qui tue']
          },
          { input: ['Papier', 'Crayons de couleur'], output: ['Pub Carglass'] },
          { input: ['Pub Carglass', 'Téléphone'], output: ['Un super réparateur'] },
          {
            input: ['Photo de classe', 'Ciseaux'],
            output: ['Photo de Pierre-Siméon']
          },
          {
            input: ['Photo de Pierre-Siméon', 'Papier'],
            output: ['Image incomplète']
          },
          {
            input: ['Image incomplète', 'Crayons de couleur'],
            output: ['Le coupable idéal']
          }
        ],
        easySolution: 'Méga glue de la mort qui tue',
        expertSolution: 'Un super réparateur',
        failSolution: 'Le coupable idéal',
        dialogsBegin: [
          'Oh non, le ballon est parti dans la fenêtre. Elle est en 1000 morceaux, je vais me faire disputer !',
          'À moins que... 😏'
        ],
        dialogsEasySolution: [
          "Héhé, cette colle est si puissante qu'elle pourrait même clouer le bec à Pierre-Siméon !",
          'Ni une ni deux, la fenêtre est réparée !'
        ],
        dialogsExpertSolution: ['Carglass répare, Carglass remplace 🎵'],
        dialogsFail: [
          'Arff, mes talents de dessin ne les ont pas convaincu, je me suis pris un sacré savon 😢🧼',
          'Pourtant mes bonhommes bâton étaient magnifiques !'
        ],
        objective: 'Ne pas se faire gronder à cause de la fenêtre cassée.'
      },
      'Le contrôle': {
        name: 'Le contrôle',
        startingItems: [
          'Papier',
          'Stylo',
          'Manuel de cours',
          'Téléphone',
          'Bouteille',
          'Taille-crayon',
          'Briquet',
          'Pétards',
          'Crayons de couleur',
          'Cartable',
          'Ciseaux'
        ],
        recipes: [
          { input: ['Stylo', 'Papier', 'Manuel de cours'], output: ['Antisèche'] },
          { input: ['Bouteille', 'Pétards'], output: ['Fusée'] },
          { input: ['Fusée', 'Téléphone'], output: ['Satellite espion'] },
          { input: ['Briquet', 'Taille-crayon'], output: ['Tôle'] },
          { input: ['Cartable', 'Tôle'], output: ['Malette'] },
          { input: ['Papier', 'Crayons de couleur'], output: ['Papier vert'] },
          {
            input: ['Papier vert', 'Ciseaux'],
            output: ['Faux billets']
          },
          {
            input: ['Papier', 'Ciseaux'],
            output: ['Papier en forme de billets']
          },
          {
            input: ['Papier en forme de billets', 'Crayons de couleur'],
            output: ['Faux billets']
          },
          { input: ['Malette', 'Faux billets'], output: ['Malette de billets'] },
          { input: ['Ciseaux', 'Pétards'], output: ['Épée'] },
          { input: ['Épée', 'Pétards'], output: ['Épée cassée'] }
        ],
        easySolution: 'Antisèche',
        expertSolution: 'Satellite espion',
        failSolution: 'Malette de billets',
        dialogsBegin: [
          "Oh non, j'ai complètement oublié de réviser pour mon contrôle !",
          'Comment est-ce que je vais faire ?'
        ],
        dialogsEasySolution: [
          "Pas très pratique sur ce petit bout de papier, mais j'ai au moins pu sauver les meubles !"
        ],
        dialogsExpertSolution: [
          "Rien n'échappe à mon super satellite 3000 ! Tricher sur mon voisin n'a jamais été aussi facile !"
        ],
        dialogsFail: [
          "Mince j'avais oublié que mon professeur était un ancien mafieux !",
          'Les faux billets ne lui ont pas vraiment plu et je crois que ses anciens amis veulent ma peau 😳'
        ],
        objective: 'Réussir le contrôle.'
      }
    };

    /* src\LevelSelection.svelte generated by Svelte v3.46.4 */

    const { Object: Object_1$1 } = globals;
    const file$8 = "src\\LevelSelection.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	child_ctx[6] = i;
    	return child_ctx;
    }

    // (21:8) {#if i === 0 || (localLevelsComplete && localLevelsComplete[levels[i - 1]])}
    function create_if_block$4(ctx) {
    	let div;
    	let button;
    	let t0_value = /*level*/ ctx[4] + "";
    	let t0;
    	let t1;
    	let div_style_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			t0 = text(t0_value);
    			t1 = space();
    			add_location(button, file$8, 24, 12, 814);
    			attr_dev(div, "class", "level paper border svelte-wduq47");
    			attr_dev(div, "style", div_style_value = "background-image : url(\"img/" + getImageDataFromName(/*level*/ ctx[4]).src + ".png\")");
    			add_location(div, file$8, 21, 8, 671);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    			append_dev(button, t0);
    			append_dev(div, t1);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*$flowScene*/ ctx[2].transitionToGame(/*level*/ ctx[4]))) /*$flowScene*/ ctx[2].transitionToGame(/*level*/ ctx[4]).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*levels*/ 1 && t0_value !== (t0_value = /*level*/ ctx[4] + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*levels*/ 1 && div_style_value !== (div_style_value = "background-image : url(\"img/" + getImageDataFromName(/*level*/ ctx[4]).src + ".png\")")) {
    				attr_dev(div, "style", div_style_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(21:8) {#if i === 0 || (localLevelsComplete && localLevelsComplete[levels[i - 1]])}",
    		ctx
    	});

    	return block;
    }

    // (20:4) {#each levels as level, i}
    function create_each_block$3(ctx) {
    	let if_block_anchor;
    	let if_block = (/*i*/ ctx[6] === 0 || /*localLevelsComplete*/ ctx[1] && /*localLevelsComplete*/ ctx[1][/*levels*/ ctx[0][/*i*/ ctx[6] - 1]]) && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*i*/ ctx[6] === 0 || /*localLevelsComplete*/ ctx[1] && /*localLevelsComplete*/ ctx[1][/*levels*/ ctx[0][/*i*/ ctx[6] - 1]]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(20:4) {#each levels as level, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div1;
    	let div0;
    	let each_value = /*levels*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "levels svelte-wduq47");
    			add_location(div0, file$8, 18, 2, 523);
    			attr_dev(div1, "class", "main svelte-wduq47");
    			add_location(div1, file$8, 17, 0, 501);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*getImageDataFromName, levels, $flowScene, localLevelsComplete*/ 7) {
    				each_value = /*levels*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let $flowScene;
    	validate_store(flowScene, 'flowScene');
    	component_subscribe($$self, flowScene, $$value => $$invalidate(2, $flowScene = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LevelSelection', slots, []);
    	let levels$1 = Object.keys(levels);

    	function reset() {
    		saveProgression(true);
    		$$invalidate(0, levels$1 = Object.keys(levels));
    	}

    	let localLevelsComplete = {};
    	levelsComplete.subscribe(completion => $$invalidate(1, localLevelsComplete = completion));
    	const writable_props = [];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LevelSelection> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		flowScene,
    		levelsComplete,
    		saveProgression,
    		levelsData: levels,
    		getImageDataFromName,
    		levels: levels$1,
    		reset,
    		localLevelsComplete,
    		$flowScene
    	});

    	$$self.$inject_state = $$props => {
    		if ('levels' in $$props) $$invalidate(0, levels$1 = $$props.levels);
    		if ('localLevelsComplete' in $$props) $$invalidate(1, localLevelsComplete = $$props.localLevelsComplete);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [levels$1, localLevelsComplete, $flowScene];
    }

    class LevelSelection extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LevelSelection",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src\Image.svelte generated by Svelte v3.46.4 */

    const file$7 = "src\\Image.svelte";

    function create_fragment$8(ctx) {
    	let main;
    	let div;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t0;
    	let p;
    	let t1_value = /*object*/ ctx[0].name + "";
    	let t1;

    	const block = {
    		c: function create() {
    			main = element("main");
    			div = element("div");
    			img = element("img");
    			t0 = space();
    			p = element("p");
    			t1 = text(t1_value);
    			if (!src_url_equal(img.src, img_src_value = "./img/" + /*object*/ ctx[0].src + ".png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*object*/ ctx[0].name);
    			attr_dev(img, "class", "svelte-ilz8yl");
    			add_location(img, file$7, 6, 4, 81);
    			add_location(p, file$7, 7, 4, 149);
    			attr_dev(div, "class", "object svelte-ilz8yl");
    			add_location(div, file$7, 5, 2, 55);
    			add_location(main, file$7, 4, 0, 45);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div);
    			append_dev(div, img);
    			append_dev(div, t0);
    			append_dev(div, p);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*object*/ 1 && !src_url_equal(img.src, img_src_value = "./img/" + /*object*/ ctx[0].src + ".png")) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*object*/ 1 && img_alt_value !== (img_alt_value = /*object*/ ctx[0].name)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*object*/ 1 && t1_value !== (t1_value = /*object*/ ctx[0].name + "")) set_data_dev(t1, t1_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Image', slots, []);
    	let { object } = $$props;
    	const writable_props = ['object'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Image> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('object' in $$props) $$invalidate(0, object = $$props.object);
    	};

    	$$self.$capture_state = () => ({ object });

    	$$self.$inject_state = $$props => {
    		if ('object' in $$props) $$invalidate(0, object = $$props.object);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [object];
    }

    class Image$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { object: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Image",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*object*/ ctx[0] === undefined && !('object' in props)) {
    			console.warn("<Image> was created without expected prop 'object'");
    		}
    	}

    	get object() {
    		throw new Error("<Image>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set object(value) {
    		throw new Error("<Image>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Achievements.svelte generated by Svelte v3.46.4 */

    const { Object: Object_1 } = globals;
    const file$6 = "src\\Achievements.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    // (85:6) {:else}
    function create_else_block_1(ctx) {
    	let div1;
    	let div0;
    	let p;
    	let t0_value = /*difficulty*/ ctx[9] + "";
    	let t0;
    	let t1;
    	let imagecomponent;
    	let div0_class_value;
    	let current;

    	imagecomponent = new Image$1({
    			props: { object: /*questionObject*/ ctx[4] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			create_component(imagecomponent.$$.fragment);
    			attr_dev(p, "class", "svelte-95xvvk");
    			add_location(p, file$6, 87, 12, 2994);
    			attr_dev(div0, "class", div0_class_value = "" + (null_to_empty("difficulty false " + /*difficulty*/ ctx[9]) + " svelte-95xvvk"));
    			add_location(div0, file$6, 86, 10, 2934);
    			attr_dev(div1, "class", "col col-3");
    			add_location(div1, file$6, 85, 8, 2899);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, p);
    			append_dev(p, t0);
    			append_dev(div0, t1);
    			mount_component(imagecomponent, div0, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*allAchievements*/ 1) && t0_value !== (t0_value = /*difficulty*/ ctx[9] + "")) set_data_dev(t0, t0_value);

    			if (!current || dirty & /*allAchievements*/ 1 && div0_class_value !== (div0_class_value = "" + (null_to_empty("difficulty false " + /*difficulty*/ ctx[9]) + " svelte-95xvvk"))) {
    				attr_dev(div0, "class", div0_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(imagecomponent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(imagecomponent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(imagecomponent);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(85:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (76:6) {#if allAchievements[key][difficulty]}
    function create_if_block_1$2(ctx) {
    	let div1;
    	let div0;
    	let p;
    	let t0_value = /*difficulty*/ ctx[9] + "";
    	let t0;
    	let t1;
    	let imagecomponent;
    	let div0_class_value;
    	let current;

    	imagecomponent = new Image$1({
    			props: {
    				object: /*allAchievements*/ ctx[0][/*key*/ ctx[6]][/*difficulty*/ ctx[9]]["object"]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			create_component(imagecomponent.$$.fragment);
    			attr_dev(p, "class", "svelte-95xvvk");
    			add_location(p, file$6, 78, 12, 2709);
    			attr_dev(div0, "class", div0_class_value = "" + (null_to_empty("difficulty true " + /*difficulty*/ ctx[9]) + " svelte-95xvvk"));
    			add_location(div0, file$6, 77, 10, 2650);
    			attr_dev(div1, "class", "col col-3");
    			add_location(div1, file$6, 76, 8, 2615);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, p);
    			append_dev(p, t0);
    			append_dev(div0, t1);
    			mount_component(imagecomponent, div0, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*allAchievements*/ 1) && t0_value !== (t0_value = /*difficulty*/ ctx[9] + "")) set_data_dev(t0, t0_value);
    			const imagecomponent_changes = {};
    			if (dirty & /*allAchievements*/ 1) imagecomponent_changes.object = /*allAchievements*/ ctx[0][/*key*/ ctx[6]][/*difficulty*/ ctx[9]]["object"];
    			imagecomponent.$set(imagecomponent_changes);

    			if (!current || dirty & /*allAchievements*/ 1 && div0_class_value !== (div0_class_value = "" + (null_to_empty("difficulty true " + /*difficulty*/ ctx[9]) + " svelte-95xvvk"))) {
    				attr_dev(div0, "class", div0_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(imagecomponent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(imagecomponent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(imagecomponent);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(76:6) {#if allAchievements[key][difficulty]}",
    		ctx
    	});

    	return block;
    }

    // (75:4) {#each Object.keys(allAchievements[key]) as difficulty}
    function create_each_block_1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$2, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*allAchievements*/ ctx[0][/*key*/ ctx[6]][/*difficulty*/ ctx[9]]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(75:4) {#each Object.keys(allAchievements[key]) as difficulty}",
    		ctx
    	});

    	return block;
    }

    // (70:0) {#each Object.keys(levelsData) as key}
    function create_each_block$2(ctx) {
    	let div1;
    	let div0;
    	let p;
    	let t0_value = /*key*/ ctx[6] + "";
    	let t0;
    	let t1;
    	let current;
    	let each_value_1 = Object.keys(/*allAchievements*/ ctx[0][/*key*/ ctx[6]]);
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(p, "class", "achievement-name svelte-95xvvk");
    			add_location(p, file$6, 72, 6, 2449);
    			attr_dev(div0, "class", "col col-3 align-middle");
    			add_location(div0, file$6, 71, 4, 2405);
    			attr_dev(div1, "class", "item row");
    			add_location(div1, file$6, 70, 2, 2377);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, p);
    			append_dev(p, t0);
    			append_dev(div1, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*Object, allAchievements, levelsData, questionObject*/ 17) {
    				each_value_1 = Object.keys(/*allAchievements*/ ctx[0][/*key*/ ctx[6]]);
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div1, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(70:0) {#each Object.keys(levelsData) as key}",
    		ctx
    	});

    	return block;
    }

    // (108:2) {:else}
    function create_else_block(ctx) {
    	let div1;
    	let div0;
    	let p;
    	let t1;
    	let imagecomponent;
    	let current;

    	imagecomponent = new Image$1({
    			props: { object: /*questionObject*/ ctx[4] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			p = element("p");
    			p.textContent = "Crafter l'épée légendaire.";
    			t1 = space();
    			create_component(imagecomponent.$$.fragment);
    			attr_dev(p, "class", "svelte-95xvvk");
    			add_location(p, file$6, 110, 8, 3564);
    			attr_dev(div0, "class", "difficulty true svelte-95xvvk");
    			add_location(div0, file$6, 109, 6, 3525);
    			attr_dev(div1, "class", "col col-3 align-middle");
    			add_location(div1, file$6, 108, 4, 3481);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, p);
    			append_dev(div0, t1);
    			mount_component(imagecomponent, div0, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(imagecomponent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(imagecomponent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(imagecomponent);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(108:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (101:2) {#if $hiddenAchievement["brokenSword"]}
    function create_if_block$3(ctx) {
    	let div1;
    	let div0;
    	let p;
    	let t1;
    	let imagecomponent;
    	let current;

    	imagecomponent = new Image$1({
    			props: { object: /*brokenSwordObject*/ ctx[5] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			p = element("p");
    			p.textContent = "Crafter l'épée légendaire.";
    			t1 = space();
    			create_component(imagecomponent.$$.fragment);
    			attr_dev(p, "class", "svelte-95xvvk");
    			add_location(p, file$6, 103, 8, 3350);
    			attr_dev(div0, "class", "difficulty true svelte-95xvvk");
    			add_location(div0, file$6, 102, 6, 3311);
    			attr_dev(div1, "class", "col col-3 align-middle");
    			add_location(div1, file$6, 101, 4, 3267);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, p);
    			append_dev(div0, t1);
    			mount_component(imagecomponent, div0, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(imagecomponent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(imagecomponent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(imagecomponent);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(101:2) {#if $hiddenAchievement[\\\"brokenSword\\\"]}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let h30;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let h31;
    	let t6;
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let each_value = Object.keys(levels);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const if_block_creators = [create_if_block$3, create_else_block];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*$hiddenAchievement*/ ctx[3]["brokenSword"]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			h30 = element("h3");
    			t0 = text(/*allAchievementsDone*/ ctx[2]);
    			t1 = text(" succés déverrouillés sur ");
    			t2 = text(/*allAchievementsCount*/ ctx[1]);
    			t3 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t4 = space();
    			h31 = element("h3");
    			h31.textContent = "Succès cachés";
    			t6 = space();
    			div = element("div");
    			if_block.c();
    			add_location(h30, file$6, 67, 0, 2253);
    			add_location(h31, file$6, 97, 0, 3170);
    			attr_dev(div, "class", "item row");
    			add_location(div, file$6, 99, 0, 3196);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h30, anchor);
    			append_dev(h30, t0);
    			append_dev(h30, t1);
    			append_dev(h30, t2);
    			insert_dev(target, t3, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t4, anchor);
    			insert_dev(target, h31, anchor);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*allAchievementsDone*/ 4) set_data_dev(t0, /*allAchievementsDone*/ ctx[2]);
    			if (!current || dirty & /*allAchievementsCount*/ 2) set_data_dev(t2, /*allAchievementsCount*/ ctx[1]);

    			if (dirty & /*Object, allAchievements, levelsData, questionObject*/ 17) {
    				each_value = Object.keys(levels);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(t4.parentNode, t4);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h30);
    			if (detaching) detach_dev(t3);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(h31);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let $hiddenAchievement;
    	validate_store(hiddenAchievement, 'hiddenAchievement');
    	component_subscribe($$self, hiddenAchievement, $$value => $$invalidate(3, $hiddenAchievement = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Achievements', slots, []);
    	const allAchievements = {};
    	let allAchievementsCount = 0;
    	let allAchievementsDone = 0;

    	for (let key in levels) {
    		allAchievements[key] = {
    			Facile: false,
    			Expert: false,
    			Raté: false
    		};

    		allAchievementsCount += 3;

    		if (get_store_value(levelsComplete)) {
    			const currentLevelComplete = get_store_value(levelsComplete)[key] || {};

    			if (currentLevelComplete["easy"] && currentLevelComplete["easy"] === true) {
    				allAchievementsDone += 1;
    				const solutionKey = levels[key]["easySolution"];
    				const currentImageObjectProp = imagesData[solutionKey];
    				currentImageObjectProp["name"] = solutionKey;

    				allAchievements[key]["Facile"] = {
    					done: true,
    					class: "easy",
    					object: currentImageObjectProp
    				};
    			}

    			if (currentLevelComplete["expert"] && currentLevelComplete["expert"] === true) {
    				allAchievementsDone += 1;
    				const solutionKey = levels[key]["expertSolution"];
    				const currentImageObjectProp = imagesData[solutionKey];
    				currentImageObjectProp["name"] = solutionKey;

    				allAchievements[key]["Expert"] = {
    					done: true,
    					class: "expert",
    					object: currentImageObjectProp
    				};
    			}

    			if (currentLevelComplete["fail"] && currentLevelComplete["fail"] === true) {
    				allAchievementsDone += 1;
    				const solutionKey = levels[key]["failSolution"];
    				const currentImageObjectProp = imagesData[solutionKey];
    				currentImageObjectProp["name"] = solutionKey;

    				allAchievements[key]["Raté"] = {
    					done: true,
    					class: "fail",
    					object: currentImageObjectProp
    				};
    			}
    		}
    	}

    	const questionObject = { src: "question", name: "Inconnu" };
    	const brokenSwordObject = { src: "epee_cassee", name: "Épée cassée" };
    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Achievements> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		ImageComponent: Image$1,
    		get: get_store_value,
    		levelsComplete,
    		hiddenAchievement,
    		levelsData: levels,
    		imagesData,
    		allAchievements,
    		allAchievementsCount,
    		allAchievementsDone,
    		questionObject,
    		brokenSwordObject,
    		$hiddenAchievement
    	});

    	$$self.$inject_state = $$props => {
    		if ('allAchievementsCount' in $$props) $$invalidate(1, allAchievementsCount = $$props.allAchievementsCount);
    		if ('allAchievementsDone' in $$props) $$invalidate(2, allAchievementsDone = $$props.allAchievementsDone);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		allAchievements,
    		allAchievementsCount,
    		allAchievementsDone,
    		$hiddenAchievement,
    		questionObject,
    		brokenSwordObject
    	];
    }

    class Achievements extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Achievements",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\Settings.svelte generated by Svelte v3.46.4 */

    const file$5 = "src\\Settings.svelte";

    function create_fragment$6(ctx) {
    	let h2;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Le jeu est déjà parfait. Pas besoin de settings.";
    			add_location(h2, file$5, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Settings', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Settings> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Settings extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Settings",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\Menu.svelte generated by Svelte v3.46.4 */
    const file$4 = "src\\Menu.svelte";

    // (14:6) <Button          size="small"          block="true"          class="inline"          on:click={$flowScene.transitionToAbout()}>
    function create_default_slot_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("À propos");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(14:6) <Button          size=\\\"small\\\"          block=\\\"true\\\"          class=\\\"inline\\\"          on:click={$flowScene.transitionToAbout()}>",
    		ctx
    	});

    	return block;
    }

    // (22:6) <Button          size="small"          block="true"          on:click={() =>            window.open("https://github.com/dsmtE/GameJamColor2022", "_blank")}          >
    function create_default_slot_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Github");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(22:6) <Button          size=\\\"small\\\"          block=\\\"true\\\"          on:click={() =>            window.open(\\\"https://github.com/dsmtE/GameJamColor2022\\\", \\\"_blank\\\")}          >",
    		ctx
    	});

    	return block;
    }

    // (6:0) <Navbar class="margin-bottom">
    function create_default_slot$1(ctx) {
    	let ul;
    	let li0;
    	let button0;
    	let t;
    	let li1;
    	let button1;
    	let current;

    	button0 = new Button({
    			props: {
    				size: "small",
    				block: "true",
    				class: "inline",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", function () {
    		if (is_function(/*$flowScene*/ ctx[0].transitionToAbout())) /*$flowScene*/ ctx[0].transitionToAbout().apply(this, arguments);
    	});

    	button1 = new Button({
    			props: {
    				size: "small",
    				block: "true",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*click_handler*/ ctx[2]);

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			li0 = element("li");
    			create_component(button0.$$.fragment);
    			t = space();
    			li1 = element("li");
    			create_component(button1.$$.fragment);
    			add_location(li0, file$4, 12, 4, 312);
    			add_location(li1, file$4, 20, 4, 493);
    			attr_dev(ul, "class", "inline");
    			add_location(ul, file$4, 11, 2, 287);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);
    			append_dev(ul, li0);
    			mount_component(button0, li0, null);
    			append_dev(ul, t);
    			append_dev(ul, li1);
    			mount_component(button1, li1, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_component(button0);
    			destroy_component(button1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(6:0) <Navbar class=\\\"margin-bottom\\\">",
    		ctx
    	});

    	return block;
    }

    // (7:2) 
    function create_brand_slot(ctx) {
    	let h3;
    	let span;
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			span = element("span");
    			t = text(/*$gameName*/ ctx[1]);
    			attr_dev(span, "class", "home-button svelte-1o7qhjp");
    			add_location(span, file$4, 7, 4, 175);
    			attr_dev(h3, "slot", "brand");
    			add_location(h3, file$4, 6, 2, 152);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, span);
    			append_dev(span, t);

    			if (!mounted) {
    				dispose = listen_dev(
    					span,
    					"click",
    					function () {
    						if (is_function(/*$flowScene*/ ctx[0].transitionToHome())) /*$flowScene*/ ctx[0].transitionToHome().apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*$gameName*/ 2) set_data_dev(t, /*$gameName*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_brand_slot.name,
    		type: "slot",
    		source: "(7:2) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let navbar;
    	let current;

    	navbar = new Navbar({
    			props: {
    				class: "margin-bottom",
    				$$slots: {
    					brand: [create_brand_slot],
    					default: [create_default_slot$1]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(navbar.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(navbar, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const navbar_changes = {};

    			if (dirty & /*$$scope, $flowScene, $gameName*/ 11) {
    				navbar_changes.$$scope = { dirty, ctx };
    			}

    			navbar.$set(navbar_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navbar, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let $flowScene;
    	let $gameName;
    	validate_store(flowScene, 'flowScene');
    	component_subscribe($$self, flowScene, $$value => $$invalidate(0, $flowScene = $$value));
    	validate_store(gameName, 'gameName');
    	component_subscribe($$self, gameName, $$value => $$invalidate(1, $gameName = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Menu', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Menu> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => window.open("https://github.com/dsmtE/GameJamColor2022", "_blank");

    	$$self.$capture_state = () => ({
    		gameName,
    		flowScene,
    		Button,
    		Navbar,
    		$flowScene,
    		$gameName
    	});

    	return [$flowScene, $gameName, click_handler];
    }

    class Menu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Menu",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    class Level {
      constructor (gameFlow) {
        this.name = gameFlow.levelName;
        this.flow = [];
        this.advancement = 0;
        this.complete = false;
        this.levelData = undefined;
        this.solutionFound = undefined;
        this.load();
      }

      load () {
        this.levelData = levels[this.name];

        this.easySolution = this.levelData['easySolution'] || '';
        this.expertSolution = this.levelData['expertSolution'] || '';
        this.failSolution = this.levelData['failSolution'] || '';

        this.startingItems = this.levelData['startingItems'] || [];
        this.recipes = this.levelData['recipes'] || [];

        this.objective = this.levelData['objective'] || '';

        this.flow = [];
        this.flow.push(
          new Dialog$1({ type: 'dialog', content: this.levelData['dialogsBegin'] })
        );
        this.flow.push(new Game({ type: 'game' }));
      }

      gameEndWithSolution (solution) {
        const possibleSolutions = {
          easy: 'dialogsEasySolution',
          expert: 'dialogsExpertSolution',
          fail: 'dialogsFail'
        };
        this.flow.push(
          new Dialog$1({
            type: 'dialog',
            content: this.levelData[possibleSolutions[solution]]
          })
        );
        this.solutionFound = solution;
      }

      ImageToPrint (solution) {
        const possibleSolutions = {
          easy: 'easySolution',
          expert: 'expertSolution',
          fail: 'failSolution'
        };
        this.flow.push(
          new Image({
            type: 'image',
            src: getImageDataFromName(this.levelData[possibleSolutions[solution]])
              .src,
            name: this.levelData[possibleSolutions[solution]]
          })
        );
      }

      isSolutionItem (item) {
        if (item === this.easySolution) return 'easy'
        if (item === this.expertSolution) return 'expert'
        if (item === this.failSolution) return 'fail'
        return false
      }

      currentFlowType () {
        return this.flow[this.advancement].type
      }

      currentFlow () {
        return this.flow[this.advancement]
      }

      advance () {
        this.advancement += 1;
      }

      isComplete () {
        if (this.flow.length - 1 < this.advancement) return true
      }

      end () {
        const newComplete = { ...get_store_value(levelsComplete) };
        if (!newComplete[this.name] || newComplete[this.name] === true) {
          newComplete[this.name] = {};
        }
        newComplete[this.name][this.solutionFound] = true;
        levelsComplete.set(newComplete);
      }
    }

    class Flow {
      constructor (params) {
        this.type = params['type'];
      }
    }

    class Dialog$1 extends Flow {
      constructor (params) {
        super(params);
        this.content = params['content'];
      }
    }

    class Game extends Flow {
      constructor (params) {
        super(params);
      }
    }

    class Image extends Flow {
      constructor (params) {
        super(params);
        this.src = params.src;
        this.name = params.name;
      }
    }

    /* src\Dialog.svelte generated by Svelte v3.46.4 */
    const file$3 = "src\\Dialog.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	child_ctx[6] = i;
    	return child_ctx;
    }

    // (24:0) {#each { length: step + 1 } as _, i}
    function create_each_block$1(ctx) {
    	let div;
    	let p;
    	let raw_value = /*dialog*/ ctx[0].content[/*i*/ ctx[6]] + "";

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			add_location(p, file$3, 25, 4, 493);
    			attr_dev(div, "class", "margin padding border border-5");
    			add_location(div, file$3, 24, 2, 443);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    			p.innerHTML = raw_value;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*dialog*/ 1 && raw_value !== (raw_value = /*dialog*/ ctx[0].content[/*i*/ ctx[6]] + "")) p.innerHTML = raw_value;		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(24:0) {#each { length: step + 1 } as _, i}",
    		ctx
    	});

    	return block;
    }

    // (30:0) <Button on:click={next}>
    function create_default_slot(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Suivant");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(30:0) <Button on:click={next}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let t;
    	let button;
    	let current;
    	let each_value = { length: /*step*/ ctx[1] + 1 };
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	button = new Button({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*next*/ ctx[2]);

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			create_component(button.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t, anchor);
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*dialog, step*/ 3) {
    				each_value = { length: /*step*/ ctx[1] + 1 };
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(t.parentNode, t);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			const button_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Dialog', slots, []);
    	const dispatch = createEventDispatcher();
    	let { dialog } = $$props;
    	let step = 0;

    	function next() {
    		if (step < dialog.content.length) {
    			$$invalidate(1, step += 1);
    		}

    		if (step == dialog.content.length) {
    			dispatch("end", { test: "s" });
    			$$invalidate(1, step = 0);
    		}
    	}

    	const writable_props = ['dialog'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Dialog> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('dialog' in $$props) $$invalidate(0, dialog = $$props.dialog);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		Button,
    		dispatch,
    		dialog,
    		step,
    		next
    	});

    	$$self.$inject_state = $$props => {
    		if ('dialog' in $$props) $$invalidate(0, dialog = $$props.dialog);
    		if ('step' in $$props) $$invalidate(1, step = $$props.step);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [dialog, step, next];
    }

    class Dialog extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { dialog: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dialog",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*dialog*/ ctx[0] === undefined && !('dialog' in props)) {
    			console.warn("<Dialog> was created without expected prop 'dialog'");
    		}
    	}

    	get dialog() {
    		throw new Error("<Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dialog(value) {
    		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function setEquality(setA, setB) {
      if (setA.size !== setB.size) return false;
      for (var a of setA) if (!setB.has(a)) return false;
      return true;
    }

    function ComputeMixing(inputElements, recipes) {
      const findIndex = recipes.findIndex(({ input, _ }) => {
        return setEquality(new Set([...inputElements]), new Set([...input]));
      });

      return findIndex !== -1 ? recipes[findIndex].output : undefined;
    }

    function getDefaultExportFromCjs (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    /* interact.js 1.10.11 | https://interactjs.io/license */

    var interact_min = createCommonjsModule(function (module, exports) {
    !function(t){module.exports=t();}((function(){var t={};Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,t.default=function(t){return !(!t||!t.Window)&&t instanceof t.Window};var e={};Object.defineProperty(e,"__esModule",{value:!0}),e.init=o,e.getWindow=function(e){return (0, t.default)(e)?e:(e.ownerDocument||e).defaultView||r.window},e.window=e.realWindow=void 0;var n=void 0;e.realWindow=n;var r=void 0;function o(t){e.realWindow=n=t;var o=t.document.createTextNode("");o.ownerDocument!==t.document&&"function"==typeof t.wrap&&t.wrap(o)===o&&(t=t.wrap(t)),e.window=r=t;}e.window=r,"undefined"!=typeof window&&window&&o(window);var i={};function a(t){return (a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(i,"__esModule",{value:!0}),i.default=void 0;var s=function(t){return !!t&&"object"===a(t)},l=function(t){return "function"==typeof t},u={window:function(n){return n===e.window||(0, t.default)(n)},docFrag:function(t){return s(t)&&11===t.nodeType},object:s,func:l,number:function(t){return "number"==typeof t},bool:function(t){return "boolean"==typeof t},string:function(t){return "string"==typeof t},element:function(t){if(!t||"object"!==a(t))return !1;var n=e.getWindow(t)||e.window;return /object|function/.test(a(n.Element))?t instanceof n.Element:1===t.nodeType&&"string"==typeof t.nodeName},plainObject:function(t){return s(t)&&!!t.constructor&&/function Object\b/.test(t.constructor.toString())},array:function(t){return s(t)&&void 0!==t.length&&l(t.splice)}};i.default=u;var c={};function f(t){var e=t.interaction;if("drag"===e.prepared.name){var n=e.prepared.axis;"x"===n?(e.coords.cur.page.y=e.coords.start.page.y,e.coords.cur.client.y=e.coords.start.client.y,e.coords.velocity.client.y=0,e.coords.velocity.page.y=0):"y"===n&&(e.coords.cur.page.x=e.coords.start.page.x,e.coords.cur.client.x=e.coords.start.client.x,e.coords.velocity.client.x=0,e.coords.velocity.page.x=0);}}function d(t){var e=t.iEvent,n=t.interaction;if("drag"===n.prepared.name){var r=n.prepared.axis;if("x"===r||"y"===r){var o="x"===r?"y":"x";e.page[o]=n.coords.start.page[o],e.client[o]=n.coords.start.client[o],e.delta[o]=0;}}}Object.defineProperty(c,"__esModule",{value:!0}),c.default=void 0;var p={id:"actions/drag",install:function(t){var e=t.actions,n=t.Interactable,r=t.defaults;n.prototype.draggable=p.draggable,e.map.drag=p,e.methodDict.drag="draggable",r.actions.drag=p.defaults;},listeners:{"interactions:before-action-move":f,"interactions:action-resume":f,"interactions:action-move":d,"auto-start:check":function(t){var e=t.interaction,n=t.interactable,r=t.buttons,o=n.options.drag;if(o&&o.enabled&&(!e.pointerIsDown||!/mouse|pointer/.test(e.pointerType)||0!=(r&n.options.drag.mouseButtons)))return t.action={name:"drag",axis:"start"===o.lockAxis?o.startAxis:o.lockAxis},!1}},draggable:function(t){return i.default.object(t)?(this.options.drag.enabled=!1!==t.enabled,this.setPerAction("drag",t),this.setOnEvents("drag",t),/^(xy|x|y|start)$/.test(t.lockAxis)&&(this.options.drag.lockAxis=t.lockAxis),/^(xy|x|y)$/.test(t.startAxis)&&(this.options.drag.startAxis=t.startAxis),this):i.default.bool(t)?(this.options.drag.enabled=t,this):this.options.drag},beforeMove:f,move:d,defaults:{startAxis:"xy",lockAxis:"xy"},getCursor:function(){return "move"}},v=p;c.default=v;var h={};Object.defineProperty(h,"__esModule",{value:!0}),h.default=void 0;var g={init:function(t){var e=t;g.document=e.document,g.DocumentFragment=e.DocumentFragment||y,g.SVGElement=e.SVGElement||y,g.SVGSVGElement=e.SVGSVGElement||y,g.SVGElementInstance=e.SVGElementInstance||y,g.Element=e.Element||y,g.HTMLElement=e.HTMLElement||g.Element,g.Event=e.Event,g.Touch=e.Touch||y,g.PointerEvent=e.PointerEvent||e.MSPointerEvent;},document:null,DocumentFragment:null,SVGElement:null,SVGSVGElement:null,SVGElementInstance:null,Element:null,HTMLElement:null,Event:null,Touch:null,PointerEvent:null};function y(){}var m=g;h.default=m;var b={};Object.defineProperty(b,"__esModule",{value:!0}),b.default=void 0;var x={init:function(t){var e=h.default.Element,n=t.navigator||{};x.supportsTouch="ontouchstart"in t||i.default.func(t.DocumentTouch)&&h.default.document instanceof t.DocumentTouch,x.supportsPointerEvent=!1!==n.pointerEnabled&&!!h.default.PointerEvent,x.isIOS=/iP(hone|od|ad)/.test(n.platform),x.isIOS7=/iP(hone|od|ad)/.test(n.platform)&&/OS 7[^\d]/.test(n.appVersion),x.isIe9=/MSIE 9/.test(n.userAgent),x.isOperaMobile="Opera"===n.appName&&x.supportsTouch&&/Presto/.test(n.userAgent),x.prefixedMatchesSelector="matches"in e.prototype?"matches":"webkitMatchesSelector"in e.prototype?"webkitMatchesSelector":"mozMatchesSelector"in e.prototype?"mozMatchesSelector":"oMatchesSelector"in e.prototype?"oMatchesSelector":"msMatchesSelector",x.pEventTypes=x.supportsPointerEvent?h.default.PointerEvent===t.MSPointerEvent?{up:"MSPointerUp",down:"MSPointerDown",over:"mouseover",out:"mouseout",move:"MSPointerMove",cancel:"MSPointerCancel"}:{up:"pointerup",down:"pointerdown",over:"pointerover",out:"pointerout",move:"pointermove",cancel:"pointercancel"}:null,x.wheelEvent=h.default.document&&"onmousewheel"in h.default.document?"mousewheel":"wheel";},supportsTouch:null,supportsPointerEvent:null,isIOS7:null,isIOS:null,isIe9:null,isOperaMobile:null,prefixedMatchesSelector:null,pEventTypes:null,wheelEvent:null},w=x;b.default=w;var _={};function P(t){var e=t.parentNode;if(i.default.docFrag(e)){for(;(e=e.host)&&i.default.docFrag(e););return e}return e}function O(t,n){return e.window!==e.realWindow&&(n=n.replace(/\/deep\//g," ")),t[b.default.prefixedMatchesSelector](n)}Object.defineProperty(_,"__esModule",{value:!0}),_.nodeContains=function(t,e){if(t.contains)return t.contains(e);for(;e;){if(e===t)return !0;e=e.parentNode;}return !1},_.closest=function(t,e){for(;i.default.element(t);){if(O(t,e))return t;t=P(t);}return null},_.parentNode=P,_.matchesSelector=O,_.indexOfDeepestElement=function(t){for(var n,r=[],o=0;o<t.length;o++){var i=t[o],a=t[n];if(i&&o!==n)if(a){var s=S(i),l=S(a);if(s!==i.ownerDocument)if(l!==i.ownerDocument)if(s!==l){r=r.length?r:E(a);var u=void 0;if(a instanceof h.default.HTMLElement&&i instanceof h.default.SVGElement&&!(i instanceof h.default.SVGSVGElement)){if(i===l)continue;u=i.ownerSVGElement;}else u=i;for(var c=E(u,a.ownerDocument),f=0;c[f]&&c[f]===r[f];)f++;var d=[c[f-1],c[f],r[f]];if(d[0])for(var p=d[0].lastChild;p;){if(p===d[1]){n=o,r=c;break}if(p===d[2])break;p=p.previousSibling;}}else v=i,g=a,(parseInt(e.getWindow(v).getComputedStyle(v).zIndex,10)||0)>=(parseInt(e.getWindow(g).getComputedStyle(g).zIndex,10)||0)&&(n=o);else n=o;}else n=o;}var v,g;return n},_.matchesUpTo=function(t,e,n){for(;i.default.element(t);){if(O(t,e))return !0;if((t=P(t))===n)return O(t,e)}return !1},_.getActualElement=function(t){return t.correspondingUseElement||t},_.getScrollXY=T,_.getElementClientRect=M,_.getElementRect=function(t){var n=M(t);if(!b.default.isIOS7&&n){var r=T(e.getWindow(t));n.left+=r.x,n.right+=r.x,n.top+=r.y,n.bottom+=r.y;}return n},_.getPath=function(t){for(var e=[];t;)e.push(t),t=P(t);return e},_.trySelector=function(t){return !!i.default.string(t)&&(h.default.document.querySelector(t),!0)};var S=function(t){return t.parentNode||t.host};function E(t,e){for(var n,r=[],o=t;(n=S(o))&&o!==e&&n!==o.ownerDocument;)r.unshift(o),o=n;return r}function T(t){return {x:(t=t||e.window).scrollX||t.document.documentElement.scrollLeft,y:t.scrollY||t.document.documentElement.scrollTop}}function M(t){var e=t instanceof h.default.SVGElement?t.getBoundingClientRect():t.getClientRects()[0];return e&&{left:e.left,right:e.right,top:e.top,bottom:e.bottom,width:e.width||e.right-e.left,height:e.height||e.bottom-e.top}}var j={};Object.defineProperty(j,"__esModule",{value:!0}),j.default=function(t,e){for(var n in e)t[n]=e[n];return t};var k={};function I(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=Array(e);n<e;n++)r[n]=t[n];return r}function D(t,e,n){return "parent"===t?(0, _.parentNode)(n):"self"===t?e.getRect(n):(0, _.closest)(n,t)}Object.defineProperty(k,"__esModule",{value:!0}),k.getStringOptionResult=D,k.resolveRectLike=function(t,e,n,r){var o,a=t;return i.default.string(a)?a=D(a,e,n):i.default.func(a)&&(a=a.apply(void 0,function(t){if(Array.isArray(t))return I(t)}(o=r)||function(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}(o)||function(t,e){if(t){if("string"==typeof t)return I(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return "Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?I(t,e):void 0}}(o)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}())),i.default.element(a)&&(a=(0, _.getElementRect)(a)),a},k.rectToXY=function(t){return t&&{x:"x"in t?t.x:t.left,y:"y"in t?t.y:t.top}},k.xywhToTlbr=function(t){return !t||"left"in t&&"top"in t||((t=(0, j.default)({},t)).left=t.x||0,t.top=t.y||0,t.right=t.right||t.left+t.width,t.bottom=t.bottom||t.top+t.height),t},k.tlbrToXywh=function(t){return !t||"x"in t&&"y"in t||((t=(0, j.default)({},t)).x=t.left||0,t.y=t.top||0,t.width=t.width||(t.right||0)-t.x,t.height=t.height||(t.bottom||0)-t.y),t},k.addEdges=function(t,e,n){t.left&&(e.left+=n.x),t.right&&(e.right+=n.x),t.top&&(e.top+=n.y),t.bottom&&(e.bottom+=n.y),e.width=e.right-e.left,e.height=e.bottom-e.top;};var A={};Object.defineProperty(A,"__esModule",{value:!0}),A.default=function(t,e,n){var r=t.options[n],o=r&&r.origin||t.options.origin,i=(0, k.resolveRectLike)(o,t,e,[t&&e]);return (0, k.rectToXY)(i)||{x:0,y:0}};var R={};function z(t){return t.trim().split(/ +/)}Object.defineProperty(R,"__esModule",{value:!0}),R.default=function t(e,n,r){if(r=r||{},i.default.string(e)&&-1!==e.search(" ")&&(e=z(e)),i.default.array(e))return e.reduce((function(e,o){return (0, j.default)(e,t(o,n,r))}),r);if(i.default.object(e)&&(n=e,e=""),i.default.func(n))r[e]=r[e]||[],r[e].push(n);else if(i.default.array(n))for(var o=0;o<n.length;o++){var a;a=n[o],t(e,a,r);}else if(i.default.object(n))for(var s in n){var l=z(s).map((function(t){return "".concat(e).concat(t)}));t(l,n[s],r);}return r};var C={};Object.defineProperty(C,"__esModule",{value:!0}),C.default=void 0,C.default=function(t,e){return Math.sqrt(t*t+e*e)};var F={};function X(t,e){for(var n in e){var r=X.prefixedPropREs,o=!1;for(var i in r)if(0===n.indexOf(i)&&r[i].test(n)){o=!0;break}o||"function"==typeof e[n]||(t[n]=e[n]);}return t}Object.defineProperty(F,"__esModule",{value:!0}),F.default=void 0,X.prefixedPropREs={webkit:/(Movement[XY]|Radius[XY]|RotationAngle|Force)$/,moz:/(Pressure)$/};var Y=X;F.default=Y;var B={};function W(t){return t instanceof h.default.Event||t instanceof h.default.Touch}function L(t,e,n){return t=t||"page",(n=n||{}).x=e[t+"X"],n.y=e[t+"Y"],n}function U(t,e){return e=e||{x:0,y:0},b.default.isOperaMobile&&W(t)?(L("screen",t,e),e.x+=window.scrollX,e.y+=window.scrollY):L("page",t,e),e}function V(t,e){return e=e||{},b.default.isOperaMobile&&W(t)?L("screen",t,e):L("client",t,e),e}function N(t){var e=[];return i.default.array(t)?(e[0]=t[0],e[1]=t[1]):"touchend"===t.type?1===t.touches.length?(e[0]=t.touches[0],e[1]=t.changedTouches[0]):0===t.touches.length&&(e[0]=t.changedTouches[0],e[1]=t.changedTouches[1]):(e[0]=t.touches[0],e[1]=t.touches[1]),e}function q(t){for(var e={pageX:0,pageY:0,clientX:0,clientY:0,screenX:0,screenY:0},n=0;n<t.length;n++){var r=t[n];for(var o in e)e[o]+=r[o];}for(var i in e)e[i]/=t.length;return e}Object.defineProperty(B,"__esModule",{value:!0}),B.copyCoords=function(t,e){t.page=t.page||{},t.page.x=e.page.x,t.page.y=e.page.y,t.client=t.client||{},t.client.x=e.client.x,t.client.y=e.client.y,t.timeStamp=e.timeStamp;},B.setCoordDeltas=function(t,e,n){t.page.x=n.page.x-e.page.x,t.page.y=n.page.y-e.page.y,t.client.x=n.client.x-e.client.x,t.client.y=n.client.y-e.client.y,t.timeStamp=n.timeStamp-e.timeStamp;},B.setCoordVelocity=function(t,e){var n=Math.max(e.timeStamp/1e3,.001);t.page.x=e.page.x/n,t.page.y=e.page.y/n,t.client.x=e.client.x/n,t.client.y=e.client.y/n,t.timeStamp=n;},B.setZeroCoords=function(t){t.page.x=0,t.page.y=0,t.client.x=0,t.client.y=0;},B.isNativePointer=W,B.getXY=L,B.getPageXY=U,B.getClientXY=V,B.getPointerId=function(t){return i.default.number(t.pointerId)?t.pointerId:t.identifier},B.setCoords=function(t,e,n){var r=e.length>1?q(e):e[0];U(r,t.page),V(r,t.client),t.timeStamp=n;},B.getTouchPair=N,B.pointerAverage=q,B.touchBBox=function(t){if(!t.length)return null;var e=N(t),n=Math.min(e[0].pageX,e[1].pageX),r=Math.min(e[0].pageY,e[1].pageY),o=Math.max(e[0].pageX,e[1].pageX),i=Math.max(e[0].pageY,e[1].pageY);return {x:n,y:r,left:n,top:r,right:o,bottom:i,width:o-n,height:i-r}},B.touchDistance=function(t,e){var n=e+"X",r=e+"Y",o=N(t),i=o[0][n]-o[1][n],a=o[0][r]-o[1][r];return (0, C.default)(i,a)},B.touchAngle=function(t,e){var n=e+"X",r=e+"Y",o=N(t),i=o[1][n]-o[0][n],a=o[1][r]-o[0][r];return 180*Math.atan2(a,i)/Math.PI},B.getPointerType=function(t){return i.default.string(t.pointerType)?t.pointerType:i.default.number(t.pointerType)?[void 0,void 0,"touch","pen","mouse"][t.pointerType]:/touch/.test(t.type||"")||t instanceof h.default.Touch?"touch":"mouse"},B.getEventTargets=function(t){var e=i.default.func(t.composedPath)?t.composedPath():t.path;return [_.getActualElement(e?e[0]:t.target),_.getActualElement(t.currentTarget)]},B.newCoords=function(){return {page:{x:0,y:0},client:{x:0,y:0},timeStamp:0}},B.coordsToEvent=function(t){return {coords:t,get page(){return this.coords.page},get client(){return this.coords.client},get timeStamp(){return this.coords.timeStamp},get pageX(){return this.coords.page.x},get pageY(){return this.coords.page.y},get clientX(){return this.coords.client.x},get clientY(){return this.coords.client.y},get pointerId(){return this.coords.pointerId},get target(){return this.coords.target},get type(){return this.coords.type},get pointerType(){return this.coords.pointerType},get buttons(){return this.coords.buttons},preventDefault:function(){}}},Object.defineProperty(B,"pointerExtend",{enumerable:!0,get:function(){return F.default}});var $={};function G(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r);}}function H(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}Object.defineProperty($,"__esModule",{value:!0}),$.BaseEvent=void 0;var K=function(){function t(e){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),H(this,"type",void 0),H(this,"target",void 0),H(this,"currentTarget",void 0),H(this,"interactable",void 0),H(this,"_interaction",void 0),H(this,"timeStamp",void 0),H(this,"immediatePropagationStopped",!1),H(this,"propagationStopped",!1),this._interaction=e;}var e,n;return e=t,(n=[{key:"preventDefault",value:function(){}},{key:"stopPropagation",value:function(){this.propagationStopped=!0;}},{key:"stopImmediatePropagation",value:function(){this.immediatePropagationStopped=this.propagationStopped=!0;}}])&&G(e.prototype,n),t}();$.BaseEvent=K,Object.defineProperty(K.prototype,"interaction",{get:function(){return this._interaction._proxy},set:function(){}});var Z={};Object.defineProperty(Z,"__esModule",{value:!0}),Z.find=Z.findIndex=Z.from=Z.merge=Z.remove=Z.contains=void 0,Z.contains=function(t,e){return -1!==t.indexOf(e)},Z.remove=function(t,e){return t.splice(t.indexOf(e),1)};var J=function(t,e){for(var n=0;n<e.length;n++){var r=e[n];t.push(r);}return t};Z.merge=J,Z.from=function(t){return J([],t)};var Q=function(t,e){for(var n=0;n<t.length;n++)if(e(t[n],n,t))return n;return -1};Z.findIndex=Q,Z.find=function(t,e){return t[Q(t,e)]};var tt={};function et(t){return (et="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function nt(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r);}}function rt(t,e){return (rt=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function ot(t,e){return !e||"object"!==et(e)&&"function"!=typeof e?it(t):e}function it(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function at(t){return (at=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function st(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}Object.defineProperty(tt,"__esModule",{value:!0}),tt.DropEvent=void 0;var lt=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&rt(t,e);}(a,t);var e,n,r,o,i=(r=a,o=function(){if("undefined"==typeof Reflect||!Reflect.construct)return !1;if(Reflect.construct.sham)return !1;if("function"==typeof Proxy)return !0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return !1}}(),function(){var t,e=at(r);if(o){var n=at(this).constructor;t=Reflect.construct(e,arguments,n);}else t=e.apply(this,arguments);return ot(this,t)});function a(t,e,n){var r;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,a),st(it(r=i.call(this,e._interaction)),"target",void 0),st(it(r),"dropzone",void 0),st(it(r),"dragEvent",void 0),st(it(r),"relatedTarget",void 0),st(it(r),"draggable",void 0),st(it(r),"timeStamp",void 0),st(it(r),"propagationStopped",!1),st(it(r),"immediatePropagationStopped",!1);var o="dragleave"===n?t.prev:t.cur,s=o.element,l=o.dropzone;return r.type=n,r.target=s,r.currentTarget=s,r.dropzone=l,r.dragEvent=e,r.relatedTarget=e.target,r.draggable=e.interactable,r.timeStamp=e.timeStamp,r}return e=a,(n=[{key:"reject",value:function(){var t=this,e=this._interaction.dropState;if("dropactivate"===this.type||this.dropzone&&e.cur.dropzone===this.dropzone&&e.cur.element===this.target)if(e.prev.dropzone=this.dropzone,e.prev.element=this.target,e.rejected=!0,e.events.enter=null,this.stopImmediatePropagation(),"dropactivate"===this.type){var n=e.activeDrops,r=Z.findIndex(n,(function(e){var n=e.dropzone,r=e.element;return n===t.dropzone&&r===t.target}));e.activeDrops.splice(r,1);var o=new a(e,this.dragEvent,"dropdeactivate");o.dropzone=this.dropzone,o.target=this.target,this.dropzone.fire(o);}else this.dropzone.fire(new a(e,this.dragEvent,"dragleave"));}},{key:"preventDefault",value:function(){}},{key:"stopPropagation",value:function(){this.propagationStopped=!0;}},{key:"stopImmediatePropagation",value:function(){this.immediatePropagationStopped=this.propagationStopped=!0;}}])&&nt(e.prototype,n),a}($.BaseEvent);tt.DropEvent=lt;var ut={};function ct(t,e){for(var n=0;n<t.slice().length;n++){var r=t.slice()[n],o=r.dropzone,i=r.element;e.dropzone=o,e.target=i,o.fire(e),e.propagationStopped=e.immediatePropagationStopped=!1;}}function ft(t,e){for(var n=function(t,e){for(var n=t.interactables,r=[],o=0;o<n.list.length;o++){var a=n.list[o];if(a.options.drop.enabled){var s=a.options.drop.accept;if(!(i.default.element(s)&&s!==e||i.default.string(s)&&!_.matchesSelector(e,s)||i.default.func(s)&&!s({dropzone:a,draggableElement:e})))for(var l=i.default.string(a.target)?a._context.querySelectorAll(a.target):i.default.array(a.target)?a.target:[a.target],u=0;u<l.length;u++){var c=l[u];c!==e&&r.push({dropzone:a,element:c,rect:a.getRect(c)});}}}return r}(t,e),r=0;r<n.length;r++){var o=n[r];o.rect=o.dropzone.getRect(o.element);}return n}function dt(t,e,n){for(var r=t.dropState,o=t.interactable,i=t.element,a=[],s=0;s<r.activeDrops.length;s++){var l=r.activeDrops[s],u=l.dropzone,c=l.element,f=l.rect;a.push(u.dropCheck(e,n,o,i,c,f)?c:null);}var d=_.indexOfDeepestElement(a);return r.activeDrops[d]||null}function pt(t,e,n){var r=t.dropState,o={enter:null,leave:null,activate:null,deactivate:null,move:null,drop:null};return "dragstart"===n.type&&(o.activate=new tt.DropEvent(r,n,"dropactivate"),o.activate.target=null,o.activate.dropzone=null),"dragend"===n.type&&(o.deactivate=new tt.DropEvent(r,n,"dropdeactivate"),o.deactivate.target=null,o.deactivate.dropzone=null),r.rejected||(r.cur.element!==r.prev.element&&(r.prev.dropzone&&(o.leave=new tt.DropEvent(r,n,"dragleave"),n.dragLeave=o.leave.target=r.prev.element,n.prevDropzone=o.leave.dropzone=r.prev.dropzone),r.cur.dropzone&&(o.enter=new tt.DropEvent(r,n,"dragenter"),n.dragEnter=r.cur.element,n.dropzone=r.cur.dropzone)),"dragend"===n.type&&r.cur.dropzone&&(o.drop=new tt.DropEvent(r,n,"drop"),n.dropzone=r.cur.dropzone,n.relatedTarget=r.cur.element),"dragmove"===n.type&&r.cur.dropzone&&(o.move=new tt.DropEvent(r,n,"dropmove"),o.move.dragmove=n,n.dropzone=r.cur.dropzone)),o}function vt(t,e){var n=t.dropState,r=n.activeDrops,o=n.cur,i=n.prev;e.leave&&i.dropzone.fire(e.leave),e.enter&&o.dropzone.fire(e.enter),e.move&&o.dropzone.fire(e.move),e.drop&&o.dropzone.fire(e.drop),e.deactivate&&ct(r,e.deactivate),n.prev.dropzone=o.dropzone,n.prev.element=o.element;}function ht(t,e){var n=t.interaction,r=t.iEvent,o=t.event;if("dragmove"===r.type||"dragend"===r.type){var i=n.dropState;e.dynamicDrop&&(i.activeDrops=ft(e,n.element));var a=r,s=dt(n,a,o);i.rejected=i.rejected&&!!s&&s.dropzone===i.cur.dropzone&&s.element===i.cur.element,i.cur.dropzone=s&&s.dropzone,i.cur.element=s&&s.element,i.events=pt(n,0,a);}}Object.defineProperty(ut,"__esModule",{value:!0}),ut.default=void 0;var gt={id:"actions/drop",install:function(t){var e=t.actions,n=t.interactStatic,r=t.Interactable,o=t.defaults;t.usePlugin(c.default),r.prototype.dropzone=function(t){return function(t,e){if(i.default.object(e)){if(t.options.drop.enabled=!1!==e.enabled,e.listeners){var n=(0, R.default)(e.listeners),r=Object.keys(n).reduce((function(t,e){return t[/^(enter|leave)/.test(e)?"drag".concat(e):/^(activate|deactivate|move)/.test(e)?"drop".concat(e):e]=n[e],t}),{});t.off(t.options.drop.listeners),t.on(r),t.options.drop.listeners=r;}return i.default.func(e.ondrop)&&t.on("drop",e.ondrop),i.default.func(e.ondropactivate)&&t.on("dropactivate",e.ondropactivate),i.default.func(e.ondropdeactivate)&&t.on("dropdeactivate",e.ondropdeactivate),i.default.func(e.ondragenter)&&t.on("dragenter",e.ondragenter),i.default.func(e.ondragleave)&&t.on("dragleave",e.ondragleave),i.default.func(e.ondropmove)&&t.on("dropmove",e.ondropmove),/^(pointer|center)$/.test(e.overlap)?t.options.drop.overlap=e.overlap:i.default.number(e.overlap)&&(t.options.drop.overlap=Math.max(Math.min(1,e.overlap),0)),"accept"in e&&(t.options.drop.accept=e.accept),"checker"in e&&(t.options.drop.checker=e.checker),t}return i.default.bool(e)?(t.options.drop.enabled=e,t):t.options.drop}(this,t)},r.prototype.dropCheck=function(t,e,n,r,o,a){return function(t,e,n,r,o,a,s){var l=!1;if(!(s=s||t.getRect(a)))return !!t.options.drop.checker&&t.options.drop.checker(e,n,l,t,a,r,o);var u=t.options.drop.overlap;if("pointer"===u){var c=(0, A.default)(r,o,"drag"),f=B.getPageXY(e);f.x+=c.x,f.y+=c.y;var d=f.x>s.left&&f.x<s.right,p=f.y>s.top&&f.y<s.bottom;l=d&&p;}var v=r.getRect(o);if(v&&"center"===u){var h=v.left+v.width/2,g=v.top+v.height/2;l=h>=s.left&&h<=s.right&&g>=s.top&&g<=s.bottom;}return v&&i.default.number(u)&&(l=Math.max(0,Math.min(s.right,v.right)-Math.max(s.left,v.left))*Math.max(0,Math.min(s.bottom,v.bottom)-Math.max(s.top,v.top))/(v.width*v.height)>=u),t.options.drop.checker&&(l=t.options.drop.checker(e,n,l,t,a,r,o)),l}(this,t,e,n,r,o,a)},n.dynamicDrop=function(e){return i.default.bool(e)?(t.dynamicDrop=e,n):t.dynamicDrop},(0, j.default)(e.phaselessTypes,{dragenter:!0,dragleave:!0,dropactivate:!0,dropdeactivate:!0,dropmove:!0,drop:!0}),e.methodDict.drop="dropzone",t.dynamicDrop=!1,o.actions.drop=gt.defaults;},listeners:{"interactions:before-action-start":function(t){var e=t.interaction;"drag"===e.prepared.name&&(e.dropState={cur:{dropzone:null,element:null},prev:{dropzone:null,element:null},rejected:null,events:null,activeDrops:[]});},"interactions:after-action-start":function(t,e){var n=t.interaction,r=(t.event,t.iEvent);if("drag"===n.prepared.name){var o=n.dropState;o.activeDrops=null,o.events=null,o.activeDrops=ft(e,n.element),o.events=pt(n,0,r),o.events.activate&&(ct(o.activeDrops,o.events.activate),e.fire("actions/drop:start",{interaction:n,dragEvent:r}));}},"interactions:action-move":ht,"interactions:after-action-move":function(t,e){var n=t.interaction,r=t.iEvent;"drag"===n.prepared.name&&(vt(n,n.dropState.events),e.fire("actions/drop:move",{interaction:n,dragEvent:r}),n.dropState.events={});},"interactions:action-end":function(t,e){if("drag"===t.interaction.prepared.name){var n=t.interaction,r=t.iEvent;ht(t,e),vt(n,n.dropState.events),e.fire("actions/drop:end",{interaction:n,dragEvent:r});}},"interactions:stop":function(t){var e=t.interaction;if("drag"===e.prepared.name){var n=e.dropState;n&&(n.activeDrops=null,n.events=null,n.cur.dropzone=null,n.cur.element=null,n.prev.dropzone=null,n.prev.element=null,n.rejected=!1);}}},getActiveDrops:ft,getDrop:dt,getDropEvents:pt,fireDropEvents:vt,defaults:{enabled:!1,accept:null,overlap:"pointer"}},yt=gt;ut.default=yt;var mt={};function bt(t){var e=t.interaction,n=t.iEvent,r=t.phase;if("gesture"===e.prepared.name){var o=e.pointers.map((function(t){return t.pointer})),a="start"===r,s="end"===r,l=e.interactable.options.deltaSource;if(n.touches=[o[0],o[1]],a)n.distance=B.touchDistance(o,l),n.box=B.touchBBox(o),n.scale=1,n.ds=0,n.angle=B.touchAngle(o,l),n.da=0,e.gesture.startDistance=n.distance,e.gesture.startAngle=n.angle;else if(s){var u=e.prevEvent;n.distance=u.distance,n.box=u.box,n.scale=u.scale,n.ds=0,n.angle=u.angle,n.da=0;}else n.distance=B.touchDistance(o,l),n.box=B.touchBBox(o),n.scale=n.distance/e.gesture.startDistance,n.angle=B.touchAngle(o,l),n.ds=n.scale-e.gesture.scale,n.da=n.angle-e.gesture.angle;e.gesture.distance=n.distance,e.gesture.angle=n.angle,i.default.number(n.scale)&&n.scale!==1/0&&!isNaN(n.scale)&&(e.gesture.scale=n.scale);}}Object.defineProperty(mt,"__esModule",{value:!0}),mt.default=void 0;var xt={id:"actions/gesture",before:["actions/drag","actions/resize"],install:function(t){var e=t.actions,n=t.Interactable,r=t.defaults;n.prototype.gesturable=function(t){return i.default.object(t)?(this.options.gesture.enabled=!1!==t.enabled,this.setPerAction("gesture",t),this.setOnEvents("gesture",t),this):i.default.bool(t)?(this.options.gesture.enabled=t,this):this.options.gesture},e.map.gesture=xt,e.methodDict.gesture="gesturable",r.actions.gesture=xt.defaults;},listeners:{"interactions:action-start":bt,"interactions:action-move":bt,"interactions:action-end":bt,"interactions:new":function(t){t.interaction.gesture={angle:0,distance:0,scale:1,startAngle:0,startDistance:0};},"auto-start:check":function(t){if(!(t.interaction.pointers.length<2)){var e=t.interactable.options.gesture;if(e&&e.enabled)return t.action={name:"gesture"},!1}}},defaults:{},getCursor:function(){return ""}},wt=xt;mt.default=wt;var _t={};function Pt(t,e,n,r,o,a,s){if(!e)return !1;if(!0===e){var l=i.default.number(a.width)?a.width:a.right-a.left,u=i.default.number(a.height)?a.height:a.bottom-a.top;if(s=Math.min(s,Math.abs(("left"===t||"right"===t?l:u)/2)),l<0&&("left"===t?t="right":"right"===t&&(t="left")),u<0&&("top"===t?t="bottom":"bottom"===t&&(t="top")),"left"===t)return n.x<(l>=0?a.left:a.right)+s;if("top"===t)return n.y<(u>=0?a.top:a.bottom)+s;if("right"===t)return n.x>(l>=0?a.right:a.left)-s;if("bottom"===t)return n.y>(u>=0?a.bottom:a.top)-s}return !!i.default.element(r)&&(i.default.element(e)?e===r:_.matchesUpTo(r,e,o))}function Ot(t){var e=t.iEvent,n=t.interaction;if("resize"===n.prepared.name&&n.resizeAxes){var r=e;n.interactable.options.resize.square?("y"===n.resizeAxes?r.delta.x=r.delta.y:r.delta.y=r.delta.x,r.axes="xy"):(r.axes=n.resizeAxes,"x"===n.resizeAxes?r.delta.y=0:"y"===n.resizeAxes&&(r.delta.x=0));}}Object.defineProperty(_t,"__esModule",{value:!0}),_t.default=void 0;var St={id:"actions/resize",before:["actions/drag"],install:function(t){var e=t.actions,n=t.browser,r=t.Interactable,o=t.defaults;St.cursors=function(t){return t.isIe9?{x:"e-resize",y:"s-resize",xy:"se-resize",top:"n-resize",left:"w-resize",bottom:"s-resize",right:"e-resize",topleft:"se-resize",bottomright:"se-resize",topright:"ne-resize",bottomleft:"ne-resize"}:{x:"ew-resize",y:"ns-resize",xy:"nwse-resize",top:"ns-resize",left:"ew-resize",bottom:"ns-resize",right:"ew-resize",topleft:"nwse-resize",bottomright:"nwse-resize",topright:"nesw-resize",bottomleft:"nesw-resize"}}(n),St.defaultMargin=n.supportsTouch||n.supportsPointerEvent?20:10,r.prototype.resizable=function(e){return function(t,e,n){return i.default.object(e)?(t.options.resize.enabled=!1!==e.enabled,t.setPerAction("resize",e),t.setOnEvents("resize",e),i.default.string(e.axis)&&/^x$|^y$|^xy$/.test(e.axis)?t.options.resize.axis=e.axis:null===e.axis&&(t.options.resize.axis=n.defaults.actions.resize.axis),i.default.bool(e.preserveAspectRatio)?t.options.resize.preserveAspectRatio=e.preserveAspectRatio:i.default.bool(e.square)&&(t.options.resize.square=e.square),t):i.default.bool(e)?(t.options.resize.enabled=e,t):t.options.resize}(this,e,t)},e.map.resize=St,e.methodDict.resize="resizable",o.actions.resize=St.defaults;},listeners:{"interactions:new":function(t){t.interaction.resizeAxes="xy";},"interactions:action-start":function(t){!function(t){var e=t.iEvent,n=t.interaction;if("resize"===n.prepared.name&&n.prepared.edges){var r=e,o=n.rect;n._rects={start:(0, j.default)({},o),corrected:(0, j.default)({},o),previous:(0, j.default)({},o),delta:{left:0,right:0,width:0,top:0,bottom:0,height:0}},r.edges=n.prepared.edges,r.rect=n._rects.corrected,r.deltaRect=n._rects.delta;}}(t),Ot(t);},"interactions:action-move":function(t){!function(t){var e=t.iEvent,n=t.interaction;if("resize"===n.prepared.name&&n.prepared.edges){var r=e,o=n.interactable.options.resize.invert,i="reposition"===o||"negate"===o,a=n.rect,s=n._rects,l=s.start,u=s.corrected,c=s.delta,f=s.previous;if((0, j.default)(f,u),i){if((0, j.default)(u,a),"reposition"===o){if(u.top>u.bottom){var d=u.top;u.top=u.bottom,u.bottom=d;}if(u.left>u.right){var p=u.left;u.left=u.right,u.right=p;}}}else u.top=Math.min(a.top,l.bottom),u.bottom=Math.max(a.bottom,l.top),u.left=Math.min(a.left,l.right),u.right=Math.max(a.right,l.left);for(var v in u.width=u.right-u.left,u.height=u.bottom-u.top,u)c[v]=u[v]-f[v];r.edges=n.prepared.edges,r.rect=u,r.deltaRect=c;}}(t),Ot(t);},"interactions:action-end":function(t){var e=t.iEvent,n=t.interaction;if("resize"===n.prepared.name&&n.prepared.edges){var r=e;r.edges=n.prepared.edges,r.rect=n._rects.corrected,r.deltaRect=n._rects.delta;}},"auto-start:check":function(t){var e=t.interaction,n=t.interactable,r=t.element,o=t.rect,a=t.buttons;if(o){var s=(0, j.default)({},e.coords.cur.page),l=n.options.resize;if(l&&l.enabled&&(!e.pointerIsDown||!/mouse|pointer/.test(e.pointerType)||0!=(a&l.mouseButtons))){if(i.default.object(l.edges)){var u={left:!1,right:!1,top:!1,bottom:!1};for(var c in u)u[c]=Pt(c,l.edges[c],s,e._latestPointer.eventTarget,r,o,l.margin||St.defaultMargin);u.left=u.left&&!u.right,u.top=u.top&&!u.bottom,(u.left||u.right||u.top||u.bottom)&&(t.action={name:"resize",edges:u});}else {var f="y"!==l.axis&&s.x>o.right-St.defaultMargin,d="x"!==l.axis&&s.y>o.bottom-St.defaultMargin;(f||d)&&(t.action={name:"resize",axes:(f?"x":"")+(d?"y":"")});}return !t.action&&void 0}}}},defaults:{square:!1,preserveAspectRatio:!1,axis:"xy",margin:NaN,edges:null,invert:"none"},cursors:null,getCursor:function(t){var e=t.edges,n=t.axis,r=t.name,o=St.cursors,i=null;if(n)i=o[r+n];else if(e){for(var a="",s=["top","bottom","left","right"],l=0;l<s.length;l++){var u=s[l];e[u]&&(a+=u);}i=o[a];}return i},defaultMargin:null},Et=St;_t.default=Et;var Tt={};Object.defineProperty(Tt,"__esModule",{value:!0}),Tt.default=void 0;var Mt={id:"actions",install:function(t){t.usePlugin(mt.default),t.usePlugin(_t.default),t.usePlugin(c.default),t.usePlugin(ut.default);}};Tt.default=Mt;var jt={};Object.defineProperty(jt,"__esModule",{value:!0}),jt.default=void 0;var kt,It,Dt=0,At={request:function(t){return kt(t)},cancel:function(t){return It(t)},init:function(t){if(kt=t.requestAnimationFrame,It=t.cancelAnimationFrame,!kt)for(var e=["ms","moz","webkit","o"],n=0;n<e.length;n++){var r=e[n];kt=t["".concat(r,"RequestAnimationFrame")],It=t["".concat(r,"CancelAnimationFrame")]||t["".concat(r,"CancelRequestAnimationFrame")];}kt=kt&&kt.bind(t),It=It&&It.bind(t),kt||(kt=function(e){var n=Date.now(),r=Math.max(0,16-(n-Dt)),o=t.setTimeout((function(){e(n+r);}),r);return Dt=n+r,o},It=function(t){return clearTimeout(t)});}};jt.default=At;var Rt={};Object.defineProperty(Rt,"__esModule",{value:!0}),Rt.getContainer=Ct,Rt.getScroll=Ft,Rt.getScrollSize=function(t){return i.default.window(t)&&(t=window.document.body),{x:t.scrollWidth,y:t.scrollHeight}},Rt.getScrollSizeDelta=function(t,e){var n=t.interaction,r=t.element,o=n&&n.interactable.options[n.prepared.name].autoScroll;if(!o||!o.enabled)return e(),{x:0,y:0};var i=Ct(o.container,n.interactable,r),a=Ft(i);e();var s=Ft(i);return {x:s.x-a.x,y:s.y-a.y}},Rt.default=void 0;var zt={defaults:{enabled:!1,margin:60,container:null,speed:300},now:Date.now,interaction:null,i:0,x:0,y:0,isScrolling:!1,prevTime:0,margin:0,speed:0,start:function(t){zt.isScrolling=!0,jt.default.cancel(zt.i),t.autoScroll=zt,zt.interaction=t,zt.prevTime=zt.now(),zt.i=jt.default.request(zt.scroll);},stop:function(){zt.isScrolling=!1,zt.interaction&&(zt.interaction.autoScroll=null),jt.default.cancel(zt.i);},scroll:function(){var t=zt.interaction,e=t.interactable,n=t.element,r=t.prepared.name,o=e.options[r].autoScroll,a=Ct(o.container,e,n),s=zt.now(),l=(s-zt.prevTime)/1e3,u=o.speed*l;if(u>=1){var c={x:zt.x*u,y:zt.y*u};if(c.x||c.y){var f=Ft(a);i.default.window(a)?a.scrollBy(c.x,c.y):a&&(a.scrollLeft+=c.x,a.scrollTop+=c.y);var d=Ft(a),p={x:d.x-f.x,y:d.y-f.y};(p.x||p.y)&&e.fire({type:"autoscroll",target:n,interactable:e,delta:p,interaction:t,container:a});}zt.prevTime=s;}zt.isScrolling&&(jt.default.cancel(zt.i),zt.i=jt.default.request(zt.scroll));},check:function(t,e){var n;return null==(n=t.options[e].autoScroll)?void 0:n.enabled},onInteractionMove:function(t){var e=t.interaction,n=t.pointer;if(e.interacting()&&zt.check(e.interactable,e.prepared.name))if(e.simulation)zt.x=zt.y=0;else {var r,o,a,s,l=e.interactable,u=e.element,c=e.prepared.name,f=l.options[c].autoScroll,d=Ct(f.container,l,u);if(i.default.window(d))s=n.clientX<zt.margin,r=n.clientY<zt.margin,o=n.clientX>d.innerWidth-zt.margin,a=n.clientY>d.innerHeight-zt.margin;else {var p=_.getElementClientRect(d);s=n.clientX<p.left+zt.margin,r=n.clientY<p.top+zt.margin,o=n.clientX>p.right-zt.margin,a=n.clientY>p.bottom-zt.margin;}zt.x=o?1:s?-1:0,zt.y=a?1:r?-1:0,zt.isScrolling||(zt.margin=f.margin,zt.speed=f.speed,zt.start(e));}}};function Ct(t,n,r){return (i.default.string(t)?(0, k.getStringOptionResult)(t,n,r):t)||(0, e.getWindow)(r)}function Ft(t){return i.default.window(t)&&(t=window.document.body),{x:t.scrollLeft,y:t.scrollTop}}var Xt={id:"auto-scroll",install:function(t){var e=t.defaults,n=t.actions;t.autoScroll=zt,zt.now=function(){return t.now()},n.phaselessTypes.autoscroll=!0,e.perAction.autoScroll=zt.defaults;},listeners:{"interactions:new":function(t){t.interaction.autoScroll=null;},"interactions:destroy":function(t){t.interaction.autoScroll=null,zt.stop(),zt.interaction&&(zt.interaction=null);},"interactions:stop":zt.stop,"interactions:action-move":function(t){return zt.onInteractionMove(t)}}};Rt.default=Xt;var Yt={};Object.defineProperty(Yt,"__esModule",{value:!0}),Yt.warnOnce=function(t,n){var r=!1;return function(){return r||(e.window.console.warn(n),r=!0),t.apply(this,arguments)}},Yt.copyAction=function(t,e){return t.name=e.name,t.axis=e.axis,t.edges=e.edges,t},Yt.sign=void 0,Yt.sign=function(t){return t>=0?1:-1};var Bt={};function Wt(t){return i.default.bool(t)?(this.options.styleCursor=t,this):null===t?(delete this.options.styleCursor,this):this.options.styleCursor}function Lt(t){return i.default.func(t)?(this.options.actionChecker=t,this):null===t?(delete this.options.actionChecker,this):this.options.actionChecker}Object.defineProperty(Bt,"__esModule",{value:!0}),Bt.default=void 0;var Ut={id:"auto-start/interactableMethods",install:function(t){var e=t.Interactable;e.prototype.getAction=function(e,n,r,o){var i=function(t,e,n,r,o){var i=t.getRect(r),a={action:null,interactable:t,interaction:n,element:r,rect:i,buttons:e.buttons||{0:1,1:4,3:8,4:16}[e.button]};return o.fire("auto-start:check",a),a.action}(this,n,r,o,t);return this.options.actionChecker?this.options.actionChecker(e,n,i,this,o,r):i},e.prototype.ignoreFrom=(0, Yt.warnOnce)((function(t){return this._backCompatOption("ignoreFrom",t)}),"Interactable.ignoreFrom() has been deprecated. Use Interactble.draggable({ignoreFrom: newValue})."),e.prototype.allowFrom=(0, Yt.warnOnce)((function(t){return this._backCompatOption("allowFrom",t)}),"Interactable.allowFrom() has been deprecated. Use Interactble.draggable({allowFrom: newValue})."),e.prototype.actionChecker=Lt,e.prototype.styleCursor=Wt;}};Bt.default=Ut;var Vt={};function Nt(t,e,n,r,o){return e.testIgnoreAllow(e.options[t.name],n,r)&&e.options[t.name].enabled&&Ht(e,n,t,o)?t:null}function qt(t,e,n,r,o,i,a){for(var s=0,l=r.length;s<l;s++){var u=r[s],c=o[s],f=u.getAction(e,n,t,c);if(f){var d=Nt(f,u,c,i,a);if(d)return {action:d,interactable:u,element:c}}}return {action:null,interactable:null,element:null}}function $t(t,e,n,r,o){var a=[],s=[],l=r;function u(t){a.push(t),s.push(l);}for(;i.default.element(l);){a=[],s=[],o.interactables.forEachMatch(l,u);var c=qt(t,e,n,a,s,r,o);if(c.action&&!c.interactable.options[c.action.name].manualStart)return c;l=_.parentNode(l);}return {action:null,interactable:null,element:null}}function Gt(t,e,n){var r=e.action,o=e.interactable,i=e.element;r=r||{name:null},t.interactable=o,t.element=i,(0, Yt.copyAction)(t.prepared,r),t.rect=o&&r.name?o.getRect(i):null,Jt(t,n),n.fire("autoStart:prepared",{interaction:t});}function Ht(t,e,n,r){var o=t.options,i=o[n.name].max,a=o[n.name].maxPerElement,s=r.autoStart.maxInteractions,l=0,u=0,c=0;if(!(i&&a&&s))return !1;for(var f=0;f<r.interactions.list.length;f++){var d=r.interactions.list[f],p=d.prepared.name;if(d.interacting()){if(++l>=s)return !1;if(d.interactable===t){if((u+=p===n.name?1:0)>=i)return !1;if(d.element===e&&(c++,p===n.name&&c>=a))return !1}}}return s>0}function Kt(t,e){return i.default.number(t)?(e.autoStart.maxInteractions=t,this):e.autoStart.maxInteractions}function Zt(t,e,n){var r=n.autoStart.cursorElement;r&&r!==t&&(r.style.cursor=""),t.ownerDocument.documentElement.style.cursor=e,t.style.cursor=e,n.autoStart.cursorElement=e?t:null;}function Jt(t,e){var n=t.interactable,r=t.element,o=t.prepared;if("mouse"===t.pointerType&&n&&n.options.styleCursor){var a="";if(o.name){var s=n.options[o.name].cursorChecker;a=i.default.func(s)?s(o,n,r,t._interacting):e.actions.map[o.name].getCursor(o);}Zt(t.element,a||"",e);}else e.autoStart.cursorElement&&Zt(e.autoStart.cursorElement,"",e);}Object.defineProperty(Vt,"__esModule",{value:!0}),Vt.default=void 0;var Qt={id:"auto-start/base",before:["actions"],install:function(t){var e=t.interactStatic,n=t.defaults;t.usePlugin(Bt.default),n.base.actionChecker=null,n.base.styleCursor=!0,(0, j.default)(n.perAction,{manualStart:!1,max:1/0,maxPerElement:1,allowFrom:null,ignoreFrom:null,mouseButtons:1}),e.maxInteractions=function(e){return Kt(e,t)},t.autoStart={maxInteractions:1/0,withinInteractionLimit:Ht,cursorElement:null};},listeners:{"interactions:down":function(t,e){var n=t.interaction,r=t.pointer,o=t.event,i=t.eventTarget;n.interacting()||Gt(n,$t(n,r,o,i,e),e);},"interactions:move":function(t,e){!function(t,e){var n=t.interaction,r=t.pointer,o=t.event,i=t.eventTarget;"mouse"!==n.pointerType||n.pointerIsDown||n.interacting()||Gt(n,$t(n,r,o,i,e),e);}(t,e),function(t,e){var n=t.interaction;if(n.pointerIsDown&&!n.interacting()&&n.pointerWasMoved&&n.prepared.name){e.fire("autoStart:before-start",t);var r=n.interactable,o=n.prepared.name;o&&r&&(r.options[o].manualStart||!Ht(r,n.element,n.prepared,e)?n.stop():(n.start(n.prepared,r,n.element),Jt(n,e)));}}(t,e);},"interactions:stop":function(t,e){var n=t.interaction,r=n.interactable;r&&r.options.styleCursor&&Zt(n.element,"",e);}},maxInteractions:Kt,withinInteractionLimit:Ht,validateAction:Nt};Vt.default=Qt;var te={};Object.defineProperty(te,"__esModule",{value:!0}),te.default=void 0;var ee={id:"auto-start/dragAxis",listeners:{"autoStart:before-start":function(t,e){var n=t.interaction,r=t.eventTarget,o=t.dx,a=t.dy;if("drag"===n.prepared.name){var s=Math.abs(o),l=Math.abs(a),u=n.interactable.options.drag,c=u.startAxis,f=s>l?"x":s<l?"y":"xy";if(n.prepared.axis="start"===u.lockAxis?f[0]:u.lockAxis,"xy"!==f&&"xy"!==c&&c!==f){n.prepared.name=null;for(var d=r,p=function(t){if(t!==n.interactable){var o=n.interactable.options.drag;if(!o.manualStart&&t.testIgnoreAllow(o,d,r)){var i=t.getAction(n.downPointer,n.downEvent,n,d);if(i&&"drag"===i.name&&function(t,e){if(!e)return !1;var n=e.options.drag.startAxis;return "xy"===t||"xy"===n||n===t}(f,t)&&Vt.default.validateAction(i,t,d,r,e))return t}}};i.default.element(d);){var v=e.interactables.forEachMatch(d,p);if(v){n.prepared.name="drag",n.interactable=v,n.element=d;break}d=(0, _.parentNode)(d);}}}}}};te.default=ee;var ne={};function re(t){var e=t.prepared&&t.prepared.name;if(!e)return null;var n=t.interactable.options;return n[e].hold||n[e].delay}Object.defineProperty(ne,"__esModule",{value:!0}),ne.default=void 0;var oe={id:"auto-start/hold",install:function(t){var e=t.defaults;t.usePlugin(Vt.default),e.perAction.hold=0,e.perAction.delay=0;},listeners:{"interactions:new":function(t){t.interaction.autoStartHoldTimer=null;},"autoStart:prepared":function(t){var e=t.interaction,n=re(e);n>0&&(e.autoStartHoldTimer=setTimeout((function(){e.start(e.prepared,e.interactable,e.element);}),n));},"interactions:move":function(t){var e=t.interaction,n=t.duplicate;e.autoStartHoldTimer&&e.pointerWasMoved&&!n&&(clearTimeout(e.autoStartHoldTimer),e.autoStartHoldTimer=null);},"autoStart:before-start":function(t){var e=t.interaction;re(e)>0&&(e.prepared.name=null);}},getHoldDuration:re};ne.default=oe;var ie={};Object.defineProperty(ie,"__esModule",{value:!0}),ie.default=void 0;var ae={id:"auto-start",install:function(t){t.usePlugin(Vt.default),t.usePlugin(ne.default),t.usePlugin(te.default);}};ie.default=ae;var se={};function le(t){return /^(always|never|auto)$/.test(t)?(this.options.preventDefault=t,this):i.default.bool(t)?(this.options.preventDefault=t?"always":"never",this):this.options.preventDefault}function ue(t){var e=t.interaction,n=t.event;e.interactable&&e.interactable.checkAndPreventDefault(n);}function ce(t){var n=t.Interactable;n.prototype.preventDefault=le,n.prototype.checkAndPreventDefault=function(n){return function(t,n,r){var o=t.options.preventDefault;if("never"!==o)if("always"!==o){if(n.events.supportsPassive&&/^touch(start|move)$/.test(r.type)){var a=(0, e.getWindow)(r.target).document,s=n.getDocOptions(a);if(!s||!s.events||!1!==s.events.passive)return}/^(mouse|pointer|touch)*(down|start)/i.test(r.type)||i.default.element(r.target)&&(0, _.matchesSelector)(r.target,"input,select,textarea,[contenteditable=true],[contenteditable=true] *")||r.preventDefault();}else r.preventDefault();}(this,t,n)},t.interactions.docEvents.push({type:"dragstart",listener:function(e){for(var n=0;n<t.interactions.list.length;n++){var r=t.interactions.list[n];if(r.element&&(r.element===e.target||(0, _.nodeContains)(r.element,e.target)))return void r.interactable.checkAndPreventDefault(e)}}});}Object.defineProperty(se,"__esModule",{value:!0}),se.install=ce,se.default=void 0;var fe={id:"core/interactablePreventDefault",install:ce,listeners:["down","move","up","cancel"].reduce((function(t,e){return t["interactions:".concat(e)]=ue,t}),{})};se.default=fe;var de={};Object.defineProperty(de,"__esModule",{value:!0}),de.default=void 0,de.default={};var pe,ve={};Object.defineProperty(ve,"__esModule",{value:!0}),ve.default=void 0,function(t){t.touchAction="touchAction",t.boxSizing="boxSizing",t.noListeners="noListeners";}(pe||(pe={}));pe.touchAction,pe.boxSizing,pe.noListeners;var he={id:"dev-tools",install:function(){}};ve.default=he;var ge={};Object.defineProperty(ge,"__esModule",{value:!0}),ge.default=function t(e){var n={};for(var r in e){var o=e[r];i.default.plainObject(o)?n[r]=t(o):i.default.array(o)?n[r]=Z.from(o):n[r]=o;}return n};var ye={};function me(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t)){var n=[],r=!0,o=!1,i=void 0;try{for(var a,s=t[Symbol.iterator]();!(r=(a=s.next()).done)&&(n.push(a.value),!e||n.length!==e);r=!0);}catch(t){o=!0,i=t;}finally{try{r||null==s.return||s.return();}finally{if(o)throw i}}return n}}(t,e)||function(t,e){if(t){if("string"==typeof t)return be(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return "Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?be(t,e):void 0}}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function be(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=Array(e);n<e;n++)r[n]=t[n];return r}function xe(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r);}}function we(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}Object.defineProperty(ye,"__esModule",{value:!0}),ye.getRectOffset=Oe,ye.default=void 0;var _e=function(){function t(e){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),we(this,"states",[]),we(this,"startOffset",{left:0,right:0,top:0,bottom:0}),we(this,"startDelta",void 0),we(this,"result",void 0),we(this,"endResult",void 0),we(this,"edges",void 0),we(this,"interaction",void 0),this.interaction=e,this.result=Pe();}var e,n;return e=t,(n=[{key:"start",value:function(t,e){var n=t.phase,r=this.interaction,o=function(t){var e=t.interactable.options[t.prepared.name],n=e.modifiers;return n&&n.length?n:["snap","snapSize","snapEdges","restrict","restrictEdges","restrictSize"].map((function(t){var n=e[t];return n&&n.enabled&&{options:n,methods:n._methods}})).filter((function(t){return !!t}))}(r);this.prepareStates(o),this.edges=(0, j.default)({},r.edges),this.startOffset=Oe(r.rect,e),this.startDelta={x:0,y:0};var i=this.fillArg({phase:n,pageCoords:e,preEnd:!1});return this.result=Pe(),this.startAll(i),this.result=this.setAll(i)}},{key:"fillArg",value:function(t){var e=this.interaction;return t.interaction=e,t.interactable=e.interactable,t.element=e.element,t.rect=t.rect||e.rect,t.edges=this.edges,t.startOffset=this.startOffset,t}},{key:"startAll",value:function(t){for(var e=0;e<this.states.length;e++){var n=this.states[e];n.methods.start&&(t.state=n,n.methods.start(t));}}},{key:"setAll",value:function(t){var e=t.phase,n=t.preEnd,r=t.skipModifiers,o=t.rect;t.coords=(0, j.default)({},t.pageCoords),t.rect=(0, j.default)({},o);for(var i=r?this.states.slice(r):this.states,a=Pe(t.coords,t.rect),s=0;s<i.length;s++){var l,u=i[s],c=u.options,f=(0, j.default)({},t.coords),d=null;null!=(l=u.methods)&&l.set&&this.shouldDo(c,n,e)&&(t.state=u,d=u.methods.set(t),k.addEdges(this.interaction.edges,t.rect,{x:t.coords.x-f.x,y:t.coords.y-f.y})),a.eventProps.push(d);}a.delta.x=t.coords.x-t.pageCoords.x,a.delta.y=t.coords.y-t.pageCoords.y,a.rectDelta.left=t.rect.left-o.left,a.rectDelta.right=t.rect.right-o.right,a.rectDelta.top=t.rect.top-o.top,a.rectDelta.bottom=t.rect.bottom-o.bottom;var p=this.result.coords,v=this.result.rect;if(p&&v){var h=a.rect.left!==v.left||a.rect.right!==v.right||a.rect.top!==v.top||a.rect.bottom!==v.bottom;a.changed=h||p.x!==a.coords.x||p.y!==a.coords.y;}return a}},{key:"applyToInteraction",value:function(t){var e=this.interaction,n=t.phase,r=e.coords.cur,o=e.coords.start,i=this.result,a=this.startDelta,s=i.delta;"start"===n&&(0, j.default)(this.startDelta,i.delta);for(var l=0;l<[[o,a],[r,s]].length;l++){var u=me([[o,a],[r,s]][l],2),c=u[0],f=u[1];c.page.x+=f.x,c.page.y+=f.y,c.client.x+=f.x,c.client.y+=f.y;}var d=this.result.rectDelta,p=t.rect||e.rect;p.left+=d.left,p.right+=d.right,p.top+=d.top,p.bottom+=d.bottom,p.width=p.right-p.left,p.height=p.bottom-p.top;}},{key:"setAndApply",value:function(t){var e=this.interaction,n=t.phase,r=t.preEnd,o=t.skipModifiers,i=this.setAll(this.fillArg({preEnd:r,phase:n,pageCoords:t.modifiedCoords||e.coords.cur.page}));if(this.result=i,!i.changed&&(!o||o<this.states.length)&&e.interacting())return !1;if(t.modifiedCoords){var a=e.coords.cur.page,s={x:t.modifiedCoords.x-a.x,y:t.modifiedCoords.y-a.y};i.coords.x+=s.x,i.coords.y+=s.y,i.delta.x+=s.x,i.delta.y+=s.y;}this.applyToInteraction(t);}},{key:"beforeEnd",value:function(t){var e=t.interaction,n=t.event,r=this.states;if(r&&r.length){for(var o=!1,i=0;i<r.length;i++){var a=r[i];t.state=a;var s=a.options,l=a.methods,u=l.beforeEnd&&l.beforeEnd(t);if(u)return this.endResult=u,!1;o=o||!o&&this.shouldDo(s,!0,t.phase,!0);}o&&e.move({event:n,preEnd:!0});}}},{key:"stop",value:function(t){var e=t.interaction;if(this.states&&this.states.length){var n=(0, j.default)({states:this.states,interactable:e.interactable,element:e.element,rect:null},t);this.fillArg(n);for(var r=0;r<this.states.length;r++){var o=this.states[r];n.state=o,o.methods.stop&&o.methods.stop(n);}this.states=null,this.endResult=null;}}},{key:"prepareStates",value:function(t){this.states=[];for(var e=0;e<t.length;e++){var n=t[e],r=n.options,o=n.methods,i=n.name;this.states.push({options:r,methods:o,index:e,name:i});}return this.states}},{key:"restoreInteractionCoords",value:function(t){var e=t.interaction,n=e.coords,r=e.rect,o=e.modification;if(o.result){for(var i=o.startDelta,a=o.result,s=a.delta,l=a.rectDelta,u=[[n.start,i],[n.cur,s]],c=0;c<u.length;c++){var f=me(u[c],2),d=f[0],p=f[1];d.page.x-=p.x,d.page.y-=p.y,d.client.x-=p.x,d.client.y-=p.y;}r.left-=l.left,r.right-=l.right,r.top-=l.top,r.bottom-=l.bottom;}}},{key:"shouldDo",value:function(t,e,n,r){return !(!t||!1===t.enabled||r&&!t.endOnly||t.endOnly&&!e||"start"===n&&!t.setStart)}},{key:"copyFrom",value:function(t){this.startOffset=t.startOffset,this.startDelta=t.startDelta,this.edges=t.edges,this.states=t.states.map((function(t){return (0, ge.default)(t)})),this.result=Pe((0, j.default)({},t.result.coords),(0, j.default)({},t.result.rect));}},{key:"destroy",value:function(){for(var t in this)this[t]=null;}}])&&xe(e.prototype,n),t}();function Pe(t,e){return {rect:e,coords:t,delta:{x:0,y:0},rectDelta:{left:0,right:0,top:0,bottom:0},eventProps:[],changed:!0}}function Oe(t,e){return t?{left:e.x-t.left,top:e.y-t.top,right:t.right-e.x,bottom:t.bottom-e.y}:{left:0,top:0,right:0,bottom:0}}ye.default=_e;var Se={};function Ee(t){var e=t.iEvent,n=t.interaction.modification.result;n&&(e.modifiers=n.eventProps);}Object.defineProperty(Se,"__esModule",{value:!0}),Se.makeModifier=function(t,e){var n=t.defaults,r={start:t.start,set:t.set,beforeEnd:t.beforeEnd,stop:t.stop},o=function(t){var o=t||{};for(var i in o.enabled=!1!==o.enabled,n)i in o||(o[i]=n[i]);var a={options:o,methods:r,name:e,enable:function(){return o.enabled=!0,a},disable:function(){return o.enabled=!1,a}};return a};return e&&"string"==typeof e&&(o._defaults=n,o._methods=r),o},Se.addEventModifiers=Ee,Se.default=void 0;var Te={id:"modifiers/base",before:["actions"],install:function(t){t.defaults.perAction.modifiers=[];},listeners:{"interactions:new":function(t){var e=t.interaction;e.modification=new ye.default(e);},"interactions:before-action-start":function(t){var e=t.interaction.modification;e.start(t,t.interaction.coords.start.page),t.interaction.edges=e.edges,e.applyToInteraction(t);},"interactions:before-action-move":function(t){return t.interaction.modification.setAndApply(t)},"interactions:before-action-end":function(t){return t.interaction.modification.beforeEnd(t)},"interactions:action-start":Ee,"interactions:action-move":Ee,"interactions:action-end":Ee,"interactions:after-action-start":function(t){return t.interaction.modification.restoreInteractionCoords(t)},"interactions:after-action-move":function(t){return t.interaction.modification.restoreInteractionCoords(t)},"interactions:stop":function(t){return t.interaction.modification.stop(t)}}};Se.default=Te;var Me={};Object.defineProperty(Me,"__esModule",{value:!0}),Me.defaults=void 0,Me.defaults={base:{preventDefault:"auto",deltaSource:"page"},perAction:{enabled:!1,origin:{x:0,y:0}},actions:{}};var je={};function ke(t){return (ke="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function Ie(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r);}}function De(t,e){return (De=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function Ae(t,e){return !e||"object"!==ke(e)&&"function"!=typeof e?Re(t):e}function Re(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function ze(t){return (ze=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function Ce(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}Object.defineProperty(je,"__esModule",{value:!0}),je.InteractEvent=void 0;var Fe=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&De(t,e);}(a,t);var e,n,r,o,i=(r=a,o=function(){if("undefined"==typeof Reflect||!Reflect.construct)return !1;if(Reflect.construct.sham)return !1;if("function"==typeof Proxy)return !0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return !1}}(),function(){var t,e=ze(r);if(o){var n=ze(this).constructor;t=Reflect.construct(e,arguments,n);}else t=e.apply(this,arguments);return Ae(this,t)});function a(t,e,n,r,o,s,l){var u;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,a),Ce(Re(u=i.call(this,t)),"target",void 0),Ce(Re(u),"currentTarget",void 0),Ce(Re(u),"relatedTarget",null),Ce(Re(u),"screenX",void 0),Ce(Re(u),"screenY",void 0),Ce(Re(u),"button",void 0),Ce(Re(u),"buttons",void 0),Ce(Re(u),"ctrlKey",void 0),Ce(Re(u),"shiftKey",void 0),Ce(Re(u),"altKey",void 0),Ce(Re(u),"metaKey",void 0),Ce(Re(u),"page",void 0),Ce(Re(u),"client",void 0),Ce(Re(u),"delta",void 0),Ce(Re(u),"rect",void 0),Ce(Re(u),"x0",void 0),Ce(Re(u),"y0",void 0),Ce(Re(u),"t0",void 0),Ce(Re(u),"dt",void 0),Ce(Re(u),"duration",void 0),Ce(Re(u),"clientX0",void 0),Ce(Re(u),"clientY0",void 0),Ce(Re(u),"velocity",void 0),Ce(Re(u),"speed",void 0),Ce(Re(u),"swipe",void 0),Ce(Re(u),"timeStamp",void 0),Ce(Re(u),"axes",void 0),Ce(Re(u),"preEnd",void 0),o=o||t.element;var c=t.interactable,f=(c&&c.options||Me.defaults).deltaSource,d=(0, A.default)(c,o,n),p="start"===r,v="end"===r,h=p?Re(u):t.prevEvent,g=p?t.coords.start:v?{page:h.page,client:h.client,timeStamp:t.coords.cur.timeStamp}:t.coords.cur;return u.page=(0, j.default)({},g.page),u.client=(0, j.default)({},g.client),u.rect=(0, j.default)({},t.rect),u.timeStamp=g.timeStamp,v||(u.page.x-=d.x,u.page.y-=d.y,u.client.x-=d.x,u.client.y-=d.y),u.ctrlKey=e.ctrlKey,u.altKey=e.altKey,u.shiftKey=e.shiftKey,u.metaKey=e.metaKey,u.button=e.button,u.buttons=e.buttons,u.target=o,u.currentTarget=o,u.preEnd=s,u.type=l||n+(r||""),u.interactable=c,u.t0=p?t.pointers[t.pointers.length-1].downTime:h.t0,u.x0=t.coords.start.page.x-d.x,u.y0=t.coords.start.page.y-d.y,u.clientX0=t.coords.start.client.x-d.x,u.clientY0=t.coords.start.client.y-d.y,u.delta=p||v?{x:0,y:0}:{x:u[f].x-h[f].x,y:u[f].y-h[f].y},u.dt=t.coords.delta.timeStamp,u.duration=u.timeStamp-u.t0,u.velocity=(0, j.default)({},t.coords.velocity[f]),u.speed=(0, C.default)(u.velocity.x,u.velocity.y),u.swipe=v||"inertiastart"===r?u.getSwipe():null,u}return e=a,(n=[{key:"getSwipe",value:function(){var t=this._interaction;if(t.prevEvent.speed<600||this.timeStamp-t.prevEvent.timeStamp>150)return null;var e=180*Math.atan2(t.prevEvent.velocityY,t.prevEvent.velocityX)/Math.PI;e<0&&(e+=360);var n=112.5<=e&&e<247.5,r=202.5<=e&&e<337.5;return {up:r,down:!r&&22.5<=e&&e<157.5,left:n,right:!n&&(292.5<=e||e<67.5),angle:e,speed:t.prevEvent.speed,velocity:{x:t.prevEvent.velocityX,y:t.prevEvent.velocityY}}}},{key:"preventDefault",value:function(){}},{key:"stopImmediatePropagation",value:function(){this.immediatePropagationStopped=this.propagationStopped=!0;}},{key:"stopPropagation",value:function(){this.propagationStopped=!0;}}])&&Ie(e.prototype,n),a}($.BaseEvent);je.InteractEvent=Fe,Object.defineProperties(Fe.prototype,{pageX:{get:function(){return this.page.x},set:function(t){this.page.x=t;}},pageY:{get:function(){return this.page.y},set:function(t){this.page.y=t;}},clientX:{get:function(){return this.client.x},set:function(t){this.client.x=t;}},clientY:{get:function(){return this.client.y},set:function(t){this.client.y=t;}},dx:{get:function(){return this.delta.x},set:function(t){this.delta.x=t;}},dy:{get:function(){return this.delta.y},set:function(t){this.delta.y=t;}},velocityX:{get:function(){return this.velocity.x},set:function(t){this.velocity.x=t;}},velocityY:{get:function(){return this.velocity.y},set:function(t){this.velocity.y=t;}}});var Xe={};function Ye(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}Object.defineProperty(Xe,"__esModule",{value:!0}),Xe.PointerInfo=void 0,Xe.PointerInfo=function t(e,n,r,o,i){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),Ye(this,"id",void 0),Ye(this,"pointer",void 0),Ye(this,"event",void 0),Ye(this,"downTime",void 0),Ye(this,"downTarget",void 0),this.id=e,this.pointer=n,this.event=r,this.downTime=o,this.downTarget=i;};var Be,We,Le={};function Ue(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r);}}function Ve(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}Object.defineProperty(Le,"__esModule",{value:!0}),Object.defineProperty(Le,"PointerInfo",{enumerable:!0,get:function(){return Xe.PointerInfo}}),Le.default=Le.Interaction=Le._ProxyMethods=Le._ProxyValues=void 0,Le._ProxyValues=Be,function(t){t.interactable="",t.element="",t.prepared="",t.pointerIsDown="",t.pointerWasMoved="",t._proxy="";}(Be||(Le._ProxyValues=Be={})),Le._ProxyMethods=We,function(t){t.start="",t.move="",t.end="",t.stop="",t.interacting="";}(We||(Le._ProxyMethods=We={}));var Ne=0,qe=function(){function t(e){var n=this,r=e.pointerType,o=e.scopeFire;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),Ve(this,"interactable",null),Ve(this,"element",null),Ve(this,"rect",void 0),Ve(this,"_rects",void 0),Ve(this,"edges",void 0),Ve(this,"_scopeFire",void 0),Ve(this,"prepared",{name:null,axis:null,edges:null}),Ve(this,"pointerType",void 0),Ve(this,"pointers",[]),Ve(this,"downEvent",null),Ve(this,"downPointer",{}),Ve(this,"_latestPointer",{pointer:null,event:null,eventTarget:null}),Ve(this,"prevEvent",null),Ve(this,"pointerIsDown",!1),Ve(this,"pointerWasMoved",!1),Ve(this,"_interacting",!1),Ve(this,"_ending",!1),Ve(this,"_stopped",!0),Ve(this,"_proxy",null),Ve(this,"simulation",null),Ve(this,"doMove",(0, Yt.warnOnce)((function(t){this.move(t);}),"The interaction.doMove() method has been renamed to interaction.move()")),Ve(this,"coords",{start:B.newCoords(),prev:B.newCoords(),cur:B.newCoords(),delta:B.newCoords(),velocity:B.newCoords()}),Ve(this,"_id",Ne++),this._scopeFire=o,this.pointerType=r;var i=this;this._proxy={};var a=function(t){Object.defineProperty(n._proxy,t,{get:function(){return i[t]}});};for(var s in Be)a(s);var l=function(t){Object.defineProperty(n._proxy,t,{value:function(){return i[t].apply(i,arguments)}});};for(var u in We)l(u);this._scopeFire("interactions:new",{interaction:this});}var e,n;return e=t,(n=[{key:"pointerMoveTolerance",get:function(){return 1}},{key:"pointerDown",value:function(t,e,n){var r=this.updatePointer(t,e,n,!0),o=this.pointers[r];this._scopeFire("interactions:down",{pointer:t,event:e,eventTarget:n,pointerIndex:r,pointerInfo:o,type:"down",interaction:this});}},{key:"start",value:function(t,e,n){return !(this.interacting()||!this.pointerIsDown||this.pointers.length<("gesture"===t.name?2:1)||!e.options[t.name].enabled)&&((0, Yt.copyAction)(this.prepared,t),this.interactable=e,this.element=n,this.rect=e.getRect(n),this.edges=this.prepared.edges?(0, j.default)({},this.prepared.edges):{left:!0,right:!0,top:!0,bottom:!0},this._stopped=!1,this._interacting=this._doPhase({interaction:this,event:this.downEvent,phase:"start"})&&!this._stopped,this._interacting)}},{key:"pointerMove",value:function(t,e,n){this.simulation||this.modification&&this.modification.endResult||this.updatePointer(t,e,n,!1);var r,o,i=this.coords.cur.page.x===this.coords.prev.page.x&&this.coords.cur.page.y===this.coords.prev.page.y&&this.coords.cur.client.x===this.coords.prev.client.x&&this.coords.cur.client.y===this.coords.prev.client.y;this.pointerIsDown&&!this.pointerWasMoved&&(r=this.coords.cur.client.x-this.coords.start.client.x,o=this.coords.cur.client.y-this.coords.start.client.y,this.pointerWasMoved=(0, C.default)(r,o)>this.pointerMoveTolerance);var a=this.getPointerIndex(t),s={pointer:t,pointerIndex:a,pointerInfo:this.pointers[a],event:e,type:"move",eventTarget:n,dx:r,dy:o,duplicate:i,interaction:this};i||B.setCoordVelocity(this.coords.velocity,this.coords.delta),this._scopeFire("interactions:move",s),i||this.simulation||(this.interacting()&&(s.type=null,this.move(s)),this.pointerWasMoved&&B.copyCoords(this.coords.prev,this.coords.cur));}},{key:"move",value:function(t){t&&t.event||B.setZeroCoords(this.coords.delta),(t=(0, j.default)({pointer:this._latestPointer.pointer,event:this._latestPointer.event,eventTarget:this._latestPointer.eventTarget,interaction:this},t||{})).phase="move",this._doPhase(t);}},{key:"pointerUp",value:function(t,e,n,r){var o=this.getPointerIndex(t);-1===o&&(o=this.updatePointer(t,e,n,!1));var i=/cancel$/i.test(e.type)?"cancel":"up";this._scopeFire("interactions:".concat(i),{pointer:t,pointerIndex:o,pointerInfo:this.pointers[o],event:e,eventTarget:n,type:i,curEventTarget:r,interaction:this}),this.simulation||this.end(e),this.removePointer(t,e);}},{key:"documentBlur",value:function(t){this.end(t),this._scopeFire("interactions:blur",{event:t,type:"blur",interaction:this});}},{key:"end",value:function(t){var e;this._ending=!0,t=t||this._latestPointer.event,this.interacting()&&(e=this._doPhase({event:t,interaction:this,phase:"end"})),this._ending=!1,!0===e&&this.stop();}},{key:"currentAction",value:function(){return this._interacting?this.prepared.name:null}},{key:"interacting",value:function(){return this._interacting}},{key:"stop",value:function(){this._scopeFire("interactions:stop",{interaction:this}),this.interactable=this.element=null,this._interacting=!1,this._stopped=!0,this.prepared.name=this.prevEvent=null;}},{key:"getPointerIndex",value:function(t){var e=B.getPointerId(t);return "mouse"===this.pointerType||"pen"===this.pointerType?this.pointers.length-1:Z.findIndex(this.pointers,(function(t){return t.id===e}))}},{key:"getPointerInfo",value:function(t){return this.pointers[this.getPointerIndex(t)]}},{key:"updatePointer",value:function(t,e,n,r){var o=B.getPointerId(t),i=this.getPointerIndex(t),a=this.pointers[i];return r=!1!==r&&(r||/(down|start)$/i.test(e.type)),a?a.pointer=t:(a=new Xe.PointerInfo(o,t,e,null,null),i=this.pointers.length,this.pointers.push(a)),B.setCoords(this.coords.cur,this.pointers.map((function(t){return t.pointer})),this._now()),B.setCoordDeltas(this.coords.delta,this.coords.prev,this.coords.cur),r&&(this.pointerIsDown=!0,a.downTime=this.coords.cur.timeStamp,a.downTarget=n,B.pointerExtend(this.downPointer,t),this.interacting()||(B.copyCoords(this.coords.start,this.coords.cur),B.copyCoords(this.coords.prev,this.coords.cur),this.downEvent=e,this.pointerWasMoved=!1)),this._updateLatestPointer(t,e,n),this._scopeFire("interactions:update-pointer",{pointer:t,event:e,eventTarget:n,down:r,pointerInfo:a,pointerIndex:i,interaction:this}),i}},{key:"removePointer",value:function(t,e){var n=this.getPointerIndex(t);if(-1!==n){var r=this.pointers[n];this._scopeFire("interactions:remove-pointer",{pointer:t,event:e,eventTarget:null,pointerIndex:n,pointerInfo:r,interaction:this}),this.pointers.splice(n,1),this.pointerIsDown=!1;}}},{key:"_updateLatestPointer",value:function(t,e,n){this._latestPointer.pointer=t,this._latestPointer.event=e,this._latestPointer.eventTarget=n;}},{key:"destroy",value:function(){this._latestPointer.pointer=null,this._latestPointer.event=null,this._latestPointer.eventTarget=null;}},{key:"_createPreparedEvent",value:function(t,e,n,r){return new je.InteractEvent(this,t,this.prepared.name,e,this.element,n,r)}},{key:"_fireEvent",value:function(t){this.interactable.fire(t),(!this.prevEvent||t.timeStamp>=this.prevEvent.timeStamp)&&(this.prevEvent=t);}},{key:"_doPhase",value:function(t){var e=t.event,n=t.phase,r=t.preEnd,o=t.type,i=this.rect;if(i&&"move"===n&&(k.addEdges(this.edges,i,this.coords.delta[this.interactable.options.deltaSource]),i.width=i.right-i.left,i.height=i.bottom-i.top),!1===this._scopeFire("interactions:before-action-".concat(n),t))return !1;var a=t.iEvent=this._createPreparedEvent(e,n,r,o);return this._scopeFire("interactions:action-".concat(n),t),"start"===n&&(this.prevEvent=a),this._fireEvent(a),this._scopeFire("interactions:after-action-".concat(n),t),!0}},{key:"_now",value:function(){return Date.now()}}])&&Ue(e.prototype,n),t}();Le.Interaction=qe;var $e=qe;Le.default=$e;var Ge={};function He(t){t.pointerIsDown&&(Qe(t.coords.cur,t.offset.total),t.offset.pending.x=0,t.offset.pending.y=0);}function Ke(t){Ze(t.interaction);}function Ze(t){if(!function(t){return !(!t.offset.pending.x&&!t.offset.pending.y)}(t))return !1;var e=t.offset.pending;return Qe(t.coords.cur,e),Qe(t.coords.delta,e),k.addEdges(t.edges,t.rect,e),e.x=0,e.y=0,!0}function Je(t){var e=t.x,n=t.y;this.offset.pending.x+=e,this.offset.pending.y+=n,this.offset.total.x+=e,this.offset.total.y+=n;}function Qe(t,e){var n=t.page,r=t.client,o=e.x,i=e.y;n.x+=o,n.y+=i,r.x+=o,r.y+=i;}Object.defineProperty(Ge,"__esModule",{value:!0}),Ge.addTotal=He,Ge.applyPending=Ze,Ge.default=void 0,Le._ProxyMethods.offsetBy="";var tn={id:"offset",before:["modifiers","pointer-events","actions","inertia"],install:function(t){t.Interaction.prototype.offsetBy=Je;},listeners:{"interactions:new":function(t){t.interaction.offset={total:{x:0,y:0},pending:{x:0,y:0}};},"interactions:update-pointer":function(t){return He(t.interaction)},"interactions:before-action-start":Ke,"interactions:before-action-move":Ke,"interactions:before-action-end":function(t){var e=t.interaction;if(Ze(e))return e.move({offset:!0}),e.end(),!1},"interactions:stop":function(t){var e=t.interaction;e.offset.total.x=0,e.offset.total.y=0,e.offset.pending.x=0,e.offset.pending.y=0;}}};Ge.default=tn;var en={};function nn(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r);}}function rn(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}Object.defineProperty(en,"__esModule",{value:!0}),en.default=en.InertiaState=void 0;var on=function(){function t(e){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),rn(this,"active",!1),rn(this,"isModified",!1),rn(this,"smoothEnd",!1),rn(this,"allowResume",!1),rn(this,"modification",void 0),rn(this,"modifierCount",0),rn(this,"modifierArg",void 0),rn(this,"startCoords",void 0),rn(this,"t0",0),rn(this,"v0",0),rn(this,"te",0),rn(this,"targetOffset",void 0),rn(this,"modifiedOffset",void 0),rn(this,"currentOffset",void 0),rn(this,"lambda_v0",0),rn(this,"one_ve_v0",0),rn(this,"timeout",void 0),rn(this,"interaction",void 0),this.interaction=e;}var e,n;return e=t,(n=[{key:"start",value:function(t){var e=this.interaction,n=an(e);if(!n||!n.enabled)return !1;var r=e.coords.velocity.client,o=(0, C.default)(r.x,r.y),i=this.modification||(this.modification=new ye.default(e));if(i.copyFrom(e.modification),this.t0=e._now(),this.allowResume=n.allowResume,this.v0=o,this.currentOffset={x:0,y:0},this.startCoords=e.coords.cur.page,this.modifierArg=i.fillArg({pageCoords:this.startCoords,preEnd:!0,phase:"inertiastart"}),this.t0-e.coords.cur.timeStamp<50&&o>n.minSpeed&&o>n.endSpeed)this.startInertia();else {if(i.result=i.setAll(this.modifierArg),!i.result.changed)return !1;this.startSmoothEnd();}return e.modification.result.rect=null,e.offsetBy(this.targetOffset),e._doPhase({interaction:e,event:t,phase:"inertiastart"}),e.offsetBy({x:-this.targetOffset.x,y:-this.targetOffset.y}),e.modification.result.rect=null,this.active=!0,e.simulation=this,!0}},{key:"startInertia",value:function(){var t=this,e=this.interaction.coords.velocity.client,n=an(this.interaction),r=n.resistance,o=-Math.log(n.endSpeed/this.v0)/r;this.targetOffset={x:(e.x-o)/r,y:(e.y-o)/r},this.te=o,this.lambda_v0=r/this.v0,this.one_ve_v0=1-n.endSpeed/this.v0;var i=this.modification,a=this.modifierArg;a.pageCoords={x:this.startCoords.x+this.targetOffset.x,y:this.startCoords.y+this.targetOffset.y},i.result=i.setAll(a),i.result.changed&&(this.isModified=!0,this.modifiedOffset={x:this.targetOffset.x+i.result.delta.x,y:this.targetOffset.y+i.result.delta.y}),this.onNextFrame((function(){return t.inertiaTick()}));}},{key:"startSmoothEnd",value:function(){var t=this;this.smoothEnd=!0,this.isModified=!0,this.targetOffset={x:this.modification.result.delta.x,y:this.modification.result.delta.y},this.onNextFrame((function(){return t.smoothEndTick()}));}},{key:"onNextFrame",value:function(t){var e=this;this.timeout=jt.default.request((function(){e.active&&t();}));}},{key:"inertiaTick",value:function(){var t,e,n,r,o,i=this,a=this.interaction,s=an(a).resistance,l=(a._now()-this.t0)/1e3;if(l<this.te){var u,c=1-(Math.exp(-s*l)-this.lambda_v0)/this.one_ve_v0;this.isModified?(t=this.targetOffset.x,e=this.targetOffset.y,n=this.modifiedOffset.x,r=this.modifiedOffset.y,u={x:sn(o=c,0,t,n),y:sn(o,0,e,r)}):u={x:this.targetOffset.x*c,y:this.targetOffset.y*c};var f={x:u.x-this.currentOffset.x,y:u.y-this.currentOffset.y};this.currentOffset.x+=f.x,this.currentOffset.y+=f.y,a.offsetBy(f),a.move(),this.onNextFrame((function(){return i.inertiaTick()}));}else a.offsetBy({x:this.modifiedOffset.x-this.currentOffset.x,y:this.modifiedOffset.y-this.currentOffset.y}),this.end();}},{key:"smoothEndTick",value:function(){var t=this,e=this.interaction,n=e._now()-this.t0,r=an(e).smoothEndDuration;if(n<r){var o={x:ln(n,0,this.targetOffset.x,r),y:ln(n,0,this.targetOffset.y,r)},i={x:o.x-this.currentOffset.x,y:o.y-this.currentOffset.y};this.currentOffset.x+=i.x,this.currentOffset.y+=i.y,e.offsetBy(i),e.move({skipModifiers:this.modifierCount}),this.onNextFrame((function(){return t.smoothEndTick()}));}else e.offsetBy({x:this.targetOffset.x-this.currentOffset.x,y:this.targetOffset.y-this.currentOffset.y}),this.end();}},{key:"resume",value:function(t){var e=t.pointer,n=t.event,r=t.eventTarget,o=this.interaction;o.offsetBy({x:-this.currentOffset.x,y:-this.currentOffset.y}),o.updatePointer(e,n,r,!0),o._doPhase({interaction:o,event:n,phase:"resume"}),(0, B.copyCoords)(o.coords.prev,o.coords.cur),this.stop();}},{key:"end",value:function(){this.interaction.move(),this.interaction.end(),this.stop();}},{key:"stop",value:function(){this.active=this.smoothEnd=!1,this.interaction.simulation=null,jt.default.cancel(this.timeout);}}])&&nn(e.prototype,n),t}();function an(t){var e=t.interactable,n=t.prepared;return e&&e.options&&n.name&&e.options[n.name].inertia}function sn(t,e,n,r){var o=1-t;return o*o*e+2*o*t*n+t*t*r}function ln(t,e,n,r){return -n*(t/=r)*(t-2)+e}en.InertiaState=on;var un={id:"inertia",before:["modifiers","actions"],install:function(t){var e=t.defaults;t.usePlugin(Ge.default),t.usePlugin(Se.default),t.actions.phases.inertiastart=!0,t.actions.phases.resume=!0,e.perAction.inertia={enabled:!1,resistance:10,minSpeed:100,endSpeed:10,allowResume:!0,smoothEndDuration:300};},listeners:{"interactions:new":function(t){var e=t.interaction;e.inertia=new on(e);},"interactions:before-action-end":function(t){var e=t.interaction,n=t.event;return (!e._interacting||e.simulation||!e.inertia.start(n))&&null},"interactions:down":function(t){var e=t.interaction,n=t.eventTarget,r=e.inertia;if(r.active)for(var o=n;i.default.element(o);){if(o===e.element){r.resume(t);break}o=_.parentNode(o);}},"interactions:stop":function(t){var e=t.interaction.inertia;e.active&&e.stop();},"interactions:before-action-resume":function(t){var e=t.interaction.modification;e.stop(t),e.start(t,t.interaction.coords.cur.page),e.applyToInteraction(t);},"interactions:before-action-inertiastart":function(t){return t.interaction.modification.setAndApply(t)},"interactions:action-resume":Se.addEventModifiers,"interactions:action-inertiastart":Se.addEventModifiers,"interactions:after-action-inertiastart":function(t){return t.interaction.modification.restoreInteractionCoords(t)},"interactions:after-action-resume":function(t){return t.interaction.modification.restoreInteractionCoords(t)}}};en.default=un;var cn={};function fn(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r);}}function dn(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function pn(t,e){for(var n=0;n<e.length;n++){var r=e[n];if(t.immediatePropagationStopped)break;r(t);}}Object.defineProperty(cn,"__esModule",{value:!0}),cn.Eventable=void 0;var vn=function(){function t(e){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),dn(this,"options",void 0),dn(this,"types",{}),dn(this,"propagationStopped",!1),dn(this,"immediatePropagationStopped",!1),dn(this,"global",void 0),this.options=(0, j.default)({},e||{});}var e,n;return e=t,(n=[{key:"fire",value:function(t){var e,n=this.global;(e=this.types[t.type])&&pn(t,e),!t.propagationStopped&&n&&(e=n[t.type])&&pn(t,e);}},{key:"on",value:function(t,e){var n=(0, R.default)(t,e);for(t in n)this.types[t]=Z.merge(this.types[t]||[],n[t]);}},{key:"off",value:function(t,e){var n=(0, R.default)(t,e);for(t in n){var r=this.types[t];if(r&&r.length)for(var o=0;o<n[t].length;o++){var i=n[t][o],a=r.indexOf(i);-1!==a&&r.splice(a,1);}}}},{key:"getRect",value:function(t){return null}}])&&fn(e.prototype,n),t}();cn.Eventable=vn;var hn={};Object.defineProperty(hn,"__esModule",{value:!0}),hn.default=function(t,e){if(e.phaselessTypes[t])return !0;for(var n in e.map)if(0===t.indexOf(n)&&t.substr(n.length)in e.phases)return !0;return !1};var gn={};Object.defineProperty(gn,"__esModule",{value:!0}),gn.createInteractStatic=function(t){var e=function e(n,r){var o=t.interactables.get(n,r);return o||((o=t.interactables.new(n,r)).events.global=e.globalEvents),o};return e.getPointerAverage=B.pointerAverage,e.getTouchBBox=B.touchBBox,e.getTouchDistance=B.touchDistance,e.getTouchAngle=B.touchAngle,e.getElementRect=_.getElementRect,e.getElementClientRect=_.getElementClientRect,e.matchesSelector=_.matchesSelector,e.closest=_.closest,e.globalEvents={},e.version="1.10.11",e.scope=t,e.use=function(t,e){return this.scope.usePlugin(t,e),this},e.isSet=function(t,e){return !!this.scope.interactables.get(t,e&&e.context)},e.on=(0, Yt.warnOnce)((function(t,e,n){if(i.default.string(t)&&-1!==t.search(" ")&&(t=t.trim().split(/ +/)),i.default.array(t)){for(var r=0;r<t.length;r++){var o=t[r];this.on(o,e,n);}return this}if(i.default.object(t)){for(var a in t)this.on(a,t[a],e);return this}return (0, hn.default)(t,this.scope.actions)?this.globalEvents[t]?this.globalEvents[t].push(e):this.globalEvents[t]=[e]:this.scope.events.add(this.scope.document,t,e,{options:n}),this}),"The interact.on() method is being deprecated"),e.off=(0, Yt.warnOnce)((function(t,e,n){if(i.default.string(t)&&-1!==t.search(" ")&&(t=t.trim().split(/ +/)),i.default.array(t)){for(var r=0;r<t.length;r++){var o=t[r];this.off(o,e,n);}return this}if(i.default.object(t)){for(var a in t)this.off(a,t[a],e);return this}var s;return (0, hn.default)(t,this.scope.actions)?t in this.globalEvents&&-1!==(s=this.globalEvents[t].indexOf(e))&&this.globalEvents[t].splice(s,1):this.scope.events.remove(this.scope.document,t,e,n),this}),"The interact.off() method is being deprecated"),e.debug=function(){return this.scope},e.supportsTouch=function(){return b.default.supportsTouch},e.supportsPointerEvent=function(){return b.default.supportsPointerEvent},e.stop=function(){for(var t=0;t<this.scope.interactions.list.length;t++)this.scope.interactions.list[t].stop();return this},e.pointerMoveTolerance=function(t){return i.default.number(t)?(this.scope.interactions.pointerMoveTolerance=t,this):this.scope.interactions.pointerMoveTolerance},e.addDocument=function(t,e){this.scope.addDocument(t,e);},e.removeDocument=function(t){this.scope.removeDocument(t);},e};var yn={};function mn(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r);}}function bn(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}Object.defineProperty(yn,"__esModule",{value:!0}),yn.Interactable=void 0;var xn=function(){function t(n,r,o,i){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),bn(this,"options",void 0),bn(this,"_actions",void 0),bn(this,"target",void 0),bn(this,"events",new cn.Eventable),bn(this,"_context",void 0),bn(this,"_win",void 0),bn(this,"_doc",void 0),bn(this,"_scopeEvents",void 0),bn(this,"_rectChecker",void 0),this._actions=r.actions,this.target=n,this._context=r.context||o,this._win=(0, e.getWindow)((0, _.trySelector)(n)?this._context:n),this._doc=this._win.document,this._scopeEvents=i,this.set(r);}var n,r;return n=t,(r=[{key:"_defaults",get:function(){return {base:{},perAction:{},actions:{}}}},{key:"setOnEvents",value:function(t,e){return i.default.func(e.onstart)&&this.on("".concat(t,"start"),e.onstart),i.default.func(e.onmove)&&this.on("".concat(t,"move"),e.onmove),i.default.func(e.onend)&&this.on("".concat(t,"end"),e.onend),i.default.func(e.oninertiastart)&&this.on("".concat(t,"inertiastart"),e.oninertiastart),this}},{key:"updatePerActionListeners",value:function(t,e,n){(i.default.array(e)||i.default.object(e))&&this.off(t,e),(i.default.array(n)||i.default.object(n))&&this.on(t,n);}},{key:"setPerAction",value:function(t,e){var n=this._defaults;for(var r in e){var o=r,a=this.options[t],s=e[o];"listeners"===o&&this.updatePerActionListeners(t,a.listeners,s),i.default.array(s)?a[o]=Z.from(s):i.default.plainObject(s)?(a[o]=(0, j.default)(a[o]||{},(0, ge.default)(s)),i.default.object(n.perAction[o])&&"enabled"in n.perAction[o]&&(a[o].enabled=!1!==s.enabled)):i.default.bool(s)&&i.default.object(n.perAction[o])?a[o].enabled=s:a[o]=s;}}},{key:"getRect",value:function(t){return t=t||(i.default.element(this.target)?this.target:null),i.default.string(this.target)&&(t=t||this._context.querySelector(this.target)),(0, _.getElementRect)(t)}},{key:"rectChecker",value:function(t){var e=this;return i.default.func(t)?(this._rectChecker=t,this.getRect=function(t){var n=(0, j.default)({},e._rectChecker(t));return "width"in n||(n.width=n.right-n.left,n.height=n.bottom-n.top),n},this):null===t?(delete this.getRect,delete this._rectChecker,this):this.getRect}},{key:"_backCompatOption",value:function(t,e){if((0, _.trySelector)(e)||i.default.object(e)){for(var n in this.options[t]=e,this._actions.map)this.options[n][t]=e;return this}return this.options[t]}},{key:"origin",value:function(t){return this._backCompatOption("origin",t)}},{key:"deltaSource",value:function(t){return "page"===t||"client"===t?(this.options.deltaSource=t,this):this.options.deltaSource}},{key:"context",value:function(){return this._context}},{key:"inContext",value:function(t){return this._context===t.ownerDocument||(0, _.nodeContains)(this._context,t)}},{key:"testIgnoreAllow",value:function(t,e,n){return !this.testIgnore(t.ignoreFrom,e,n)&&this.testAllow(t.allowFrom,e,n)}},{key:"testAllow",value:function(t,e,n){return !t||!!i.default.element(n)&&(i.default.string(t)?(0, _.matchesUpTo)(n,t,e):!!i.default.element(t)&&(0, _.nodeContains)(t,n))}},{key:"testIgnore",value:function(t,e,n){return !(!t||!i.default.element(n))&&(i.default.string(t)?(0, _.matchesUpTo)(n,t,e):!!i.default.element(t)&&(0, _.nodeContains)(t,n))}},{key:"fire",value:function(t){return this.events.fire(t),this}},{key:"_onOff",value:function(t,e,n,r){i.default.object(e)&&!i.default.array(e)&&(r=n,n=null);var o="on"===t?"add":"remove",a=(0, R.default)(e,n);for(var s in a){"wheel"===s&&(s=b.default.wheelEvent);for(var l=0;l<a[s].length;l++){var u=a[s][l];(0, hn.default)(s,this._actions)?this.events[t](s,u):i.default.string(this.target)?this._scopeEvents["".concat(o,"Delegate")](this.target,this._context,s,u,r):this._scopeEvents[o](this.target,s,u,r);}}return this}},{key:"on",value:function(t,e,n){return this._onOff("on",t,e,n)}},{key:"off",value:function(t,e,n){return this._onOff("off",t,e,n)}},{key:"set",value:function(t){var e=this._defaults;for(var n in i.default.object(t)||(t={}),this.options=(0, ge.default)(e.base),this._actions.methodDict){var r=n,o=this._actions.methodDict[r];this.options[r]={},this.setPerAction(r,(0, j.default)((0, j.default)({},e.perAction),e.actions[r])),this[o](t[r]);}for(var a in t)i.default.func(this[a])&&this[a](t[a]);return this}},{key:"unset",value:function(){if(i.default.string(this.target))for(var t in this._scopeEvents.delegatedEvents)for(var e=this._scopeEvents.delegatedEvents[t],n=e.length-1;n>=0;n--){var r=e[n],o=r.selector,a=r.context,s=r.listeners;o===this.target&&a===this._context&&e.splice(n,1);for(var l=s.length-1;l>=0;l--)this._scopeEvents.removeDelegate(this.target,this._context,t,s[l][0],s[l][1]);}else this._scopeEvents.remove(this.target,"all");}}])&&mn(n.prototype,r),t}();yn.Interactable=xn;var wn={};function _n(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r);}}function Pn(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}Object.defineProperty(wn,"__esModule",{value:!0}),wn.InteractableSet=void 0;var On=function(){function t(e){var n=this;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),Pn(this,"list",[]),Pn(this,"selectorMap",{}),Pn(this,"scope",void 0),this.scope=e,e.addListeners({"interactable:unset":function(t){var e=t.interactable,r=e.target,o=e._context,a=i.default.string(r)?n.selectorMap[r]:r[n.scope.id],s=Z.findIndex(a,(function(t){return t.context===o}));a[s]&&(a[s].context=null,a[s].interactable=null),a.splice(s,1);}});}var e,n;return e=t,(n=[{key:"new",value:function(t,e){e=(0, j.default)(e||{},{actions:this.scope.actions});var n=new this.scope.Interactable(t,e,this.scope.document,this.scope.events),r={context:n._context,interactable:n};return this.scope.addDocument(n._doc),this.list.push(n),i.default.string(t)?(this.selectorMap[t]||(this.selectorMap[t]=[]),this.selectorMap[t].push(r)):(n.target[this.scope.id]||Object.defineProperty(t,this.scope.id,{value:[],configurable:!0}),t[this.scope.id].push(r)),this.scope.fire("interactable:new",{target:t,options:e,interactable:n,win:this.scope._win}),n}},{key:"get",value:function(t,e){var n=e&&e.context||this.scope.document,r=i.default.string(t),o=r?this.selectorMap[t]:t[this.scope.id];if(!o)return null;var a=Z.find(o,(function(e){return e.context===n&&(r||e.interactable.inContext(t))}));return a&&a.interactable}},{key:"forEachMatch",value:function(t,e){for(var n=0;n<this.list.length;n++){var r=this.list[n],o=void 0;if((i.default.string(r.target)?i.default.element(t)&&_.matchesSelector(t,r.target):t===r.target)&&r.inContext(t)&&(o=e(r)),void 0!==o)return o}}}])&&_n(e.prototype,n),t}();wn.InteractableSet=On;var Sn={};function En(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r);}}function Tn(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function Mn(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t)){var n=[],r=!0,o=!1,i=void 0;try{for(var a,s=t[Symbol.iterator]();!(r=(a=s.next()).done)&&(n.push(a.value),!e||n.length!==e);r=!0);}catch(t){o=!0,i=t;}finally{try{r||null==s.return||s.return();}finally{if(o)throw i}}return n}}(t,e)||function(t,e){if(t){if("string"==typeof t)return jn(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return "Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?jn(t,e):void 0}}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function jn(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=Array(e);n<e;n++)r[n]=t[n];return r}Object.defineProperty(Sn,"__esModule",{value:!0}),Sn.default=void 0;var kn=function(){function t(e){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),Tn(this,"currentTarget",void 0),Tn(this,"originalEvent",void 0),Tn(this,"type",void 0),this.originalEvent=e,(0, F.default)(this,e);}var e,n;return e=t,(n=[{key:"preventOriginalDefault",value:function(){this.originalEvent.preventDefault();}},{key:"stopPropagation",value:function(){this.originalEvent.stopPropagation();}},{key:"stopImmediatePropagation",value:function(){this.originalEvent.stopImmediatePropagation();}}])&&En(e.prototype,n),t}();function In(t){if(!i.default.object(t))return {capture:!!t,passive:!1};var e=(0, j.default)({},t);return e.capture=!!t.capture,e.passive=!!t.passive,e}var Dn={id:"events",install:function(t){var e,n=[],r={},o=[],a={add:s,remove:l,addDelegate:function(t,e,n,i,a){var l=In(a);if(!r[n]){r[n]=[];for(var f=0;f<o.length;f++){var d=o[f];s(d,n,u),s(d,n,c,!0);}}var p=r[n],v=Z.find(p,(function(n){return n.selector===t&&n.context===e}));v||(v={selector:t,context:e,listeners:[]},p.push(v)),v.listeners.push([i,l]);},removeDelegate:function(t,e,n,o,i){var a,s=In(i),f=r[n],d=!1;if(f)for(a=f.length-1;a>=0;a--){var p=f[a];if(p.selector===t&&p.context===e){for(var v=p.listeners,h=v.length-1;h>=0;h--){var g=Mn(v[h],2),y=g[0],m=g[1],b=m.capture,x=m.passive;if(y===o&&b===s.capture&&x===s.passive){v.splice(h,1),v.length||(f.splice(a,1),l(e,n,u),l(e,n,c,!0)),d=!0;break}}if(d)break}}},delegateListener:u,delegateUseCapture:c,delegatedEvents:r,documents:o,targets:n,supportsOptions:!1,supportsPassive:!1};function s(t,e,r,o){var i=In(o),s=Z.find(n,(function(e){return e.eventTarget===t}));s||(s={eventTarget:t,events:{}},n.push(s)),s.events[e]||(s.events[e]=[]),t.addEventListener&&!Z.contains(s.events[e],r)&&(t.addEventListener(e,r,a.supportsOptions?i:i.capture),s.events[e].push(r));}function l(t,e,r,o){var i=In(o),s=Z.findIndex(n,(function(e){return e.eventTarget===t})),u=n[s];if(u&&u.events)if("all"!==e){var c=!1,f=u.events[e];if(f){if("all"===r){for(var d=f.length-1;d>=0;d--)l(t,e,f[d],i);return}for(var p=0;p<f.length;p++)if(f[p]===r){t.removeEventListener(e,r,a.supportsOptions?i:i.capture),f.splice(p,1),0===f.length&&(delete u.events[e],c=!0);break}}c&&!Object.keys(u.events).length&&n.splice(s,1);}else for(e in u.events)u.events.hasOwnProperty(e)&&l(t,e,"all");}function u(t,e){for(var n=In(e),o=new kn(t),a=r[t.type],s=Mn(B.getEventTargets(t),1)[0],l=s;i.default.element(l);){for(var u=0;u<a.length;u++){var c=a[u],f=c.selector,d=c.context;if(_.matchesSelector(l,f)&&_.nodeContains(d,s)&&_.nodeContains(d,l)){var p=c.listeners;o.currentTarget=l;for(var v=0;v<p.length;v++){var h=Mn(p[v],2),g=h[0],y=h[1],m=y.capture,b=y.passive;m===n.capture&&b===n.passive&&g(o);}}}l=_.parentNode(l);}}function c(t){return u(t,!0)}return null==(e=t.document)||e.createElement("div").addEventListener("test",null,{get capture(){return a.supportsOptions=!0},get passive(){return a.supportsPassive=!0}}),t.events=a,a}};Sn.default=Dn;var An={};Object.defineProperty(An,"__esModule",{value:!0}),An.default=void 0;var Rn={methodOrder:["simulationResume","mouseOrPen","hasPointer","idle"],search:function(t){for(var e=0;e<Rn.methodOrder.length;e++){var n;n=Rn.methodOrder[e];var r=Rn[n](t);if(r)return r}return null},simulationResume:function(t){var e=t.pointerType,n=t.eventType,r=t.eventTarget,o=t.scope;if(!/down|start/i.test(n))return null;for(var i=0;i<o.interactions.list.length;i++){var a=o.interactions.list[i],s=r;if(a.simulation&&a.simulation.allowResume&&a.pointerType===e)for(;s;){if(s===a.element)return a;s=_.parentNode(s);}}return null},mouseOrPen:function(t){var e,n=t.pointerId,r=t.pointerType,o=t.eventType,i=t.scope;if("mouse"!==r&&"pen"!==r)return null;for(var a=0;a<i.interactions.list.length;a++){var s=i.interactions.list[a];if(s.pointerType===r){if(s.simulation&&!zn(s,n))continue;if(s.interacting())return s;e||(e=s);}}if(e)return e;for(var l=0;l<i.interactions.list.length;l++){var u=i.interactions.list[l];if(!(u.pointerType!==r||/down/i.test(o)&&u.simulation))return u}return null},hasPointer:function(t){for(var e=t.pointerId,n=t.scope,r=0;r<n.interactions.list.length;r++){var o=n.interactions.list[r];if(zn(o,e))return o}return null},idle:function(t){for(var e=t.pointerType,n=t.scope,r=0;r<n.interactions.list.length;r++){var o=n.interactions.list[r];if(1===o.pointers.length){var i=o.interactable;if(i&&(!i.options.gesture||!i.options.gesture.enabled))continue}else if(o.pointers.length>=2)continue;if(!o.interacting()&&e===o.pointerType)return o}return null}};function zn(t,e){return t.pointers.some((function(t){return t.id===e}))}var Cn=Rn;An.default=Cn;var Fn={};function Xn(t){return (Xn="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function Yn(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t)){var n=[],r=!0,o=!1,i=void 0;try{for(var a,s=t[Symbol.iterator]();!(r=(a=s.next()).done)&&(n.push(a.value),!e||n.length!==e);r=!0);}catch(t){o=!0,i=t;}finally{try{r||null==s.return||s.return();}finally{if(o)throw i}}return n}}(t,e)||function(t,e){if(t){if("string"==typeof t)return Bn(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return "Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?Bn(t,e):void 0}}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function Bn(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=Array(e);n<e;n++)r[n]=t[n];return r}function Wn(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function Ln(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r);}}function Un(t,e){return (Un=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function Vn(t,e){return !e||"object"!==Xn(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function Nn(t){return (Nn=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}Object.defineProperty(Fn,"__esModule",{value:!0}),Fn.default=void 0;var qn=["pointerDown","pointerMove","pointerUp","updatePointer","removePointer","windowBlur"];function $n(t,e){return function(n){var r=e.interactions.list,o=B.getPointerType(n),i=Yn(B.getEventTargets(n),2),a=i[0],s=i[1],l=[];if(/^touch/.test(n.type)){e.prevTouchTime=e.now();for(var u=0;u<n.changedTouches.length;u++){var c=n.changedTouches[u],f={pointer:c,pointerId:B.getPointerId(c),pointerType:o,eventType:n.type,eventTarget:a,curEventTarget:s,scope:e},d=Gn(f);l.push([f.pointer,f.eventTarget,f.curEventTarget,d]);}}else {var p=!1;if(!b.default.supportsPointerEvent&&/mouse/.test(n.type)){for(var v=0;v<r.length&&!p;v++)p="mouse"!==r[v].pointerType&&r[v].pointerIsDown;p=p||e.now()-e.prevTouchTime<500||0===n.timeStamp;}if(!p){var h={pointer:n,pointerId:B.getPointerId(n),pointerType:o,eventType:n.type,curEventTarget:s,eventTarget:a,scope:e},g=Gn(h);l.push([h.pointer,h.eventTarget,h.curEventTarget,g]);}}for(var y=0;y<l.length;y++){var m=Yn(l[y],4),x=m[0],w=m[1],_=m[2];m[3][t](x,n,w,_);}}}function Gn(t){var e=t.pointerType,n=t.scope,r={interaction:An.default.search(t),searchDetails:t};return n.fire("interactions:find",r),r.interaction||n.interactions.new({pointerType:e})}function Hn(t,e){var n=t.doc,r=t.scope,o=t.options,i=r.interactions.docEvents,a=r.events,s=a[e];for(var l in r.browser.isIOS&&!o.events&&(o.events={passive:!1}),a.delegatedEvents)s(n,l,a.delegateListener),s(n,l,a.delegateUseCapture,!0);for(var u=o&&o.events,c=0;c<i.length;c++){var f=i[c];s(n,f.type,f.listener,u);}}var Kn={id:"core/interactions",install:function(t){for(var e={},n=0;n<qn.length;n++){var r=qn[n];e[r]=$n(r,t);}var o,i=b.default.pEventTypes;function a(){for(var e=0;e<t.interactions.list.length;e++){var n=t.interactions.list[e];if(n.pointerIsDown&&"touch"===n.pointerType&&!n._interacting)for(var r=function(){var e=n.pointers[o];t.documents.some((function(t){var n=t.doc;return (0, _.nodeContains)(n,e.downTarget)}))||n.removePointer(e.pointer,e.event);},o=0;o<n.pointers.length;o++)r();}}(o=h.default.PointerEvent?[{type:i.down,listener:a},{type:i.down,listener:e.pointerDown},{type:i.move,listener:e.pointerMove},{type:i.up,listener:e.pointerUp},{type:i.cancel,listener:e.pointerUp}]:[{type:"mousedown",listener:e.pointerDown},{type:"mousemove",listener:e.pointerMove},{type:"mouseup",listener:e.pointerUp},{type:"touchstart",listener:a},{type:"touchstart",listener:e.pointerDown},{type:"touchmove",listener:e.pointerMove},{type:"touchend",listener:e.pointerUp},{type:"touchcancel",listener:e.pointerUp}]).push({type:"blur",listener:function(e){for(var n=0;n<t.interactions.list.length;n++)t.interactions.list[n].documentBlur(e);}}),t.prevTouchTime=0,t.Interaction=function(e){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&Un(t,e);}(s,e);var n,r,o,i,a=(o=s,i=function(){if("undefined"==typeof Reflect||!Reflect.construct)return !1;if(Reflect.construct.sham)return !1;if("function"==typeof Proxy)return !0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return !1}}(),function(){var t,e=Nn(o);if(i){var n=Nn(this).constructor;t=Reflect.construct(e,arguments,n);}else t=e.apply(this,arguments);return Vn(this,t)});function s(){return Wn(this,s),a.apply(this,arguments)}return n=s,(r=[{key:"pointerMoveTolerance",get:function(){return t.interactions.pointerMoveTolerance},set:function(e){t.interactions.pointerMoveTolerance=e;}},{key:"_now",value:function(){return t.now()}}])&&Ln(n.prototype,r),s}(Le.default),t.interactions={list:[],new:function(e){e.scopeFire=function(e,n){return t.fire(e,n)};var n=new t.Interaction(e);return t.interactions.list.push(n),n},listeners:e,docEvents:o,pointerMoveTolerance:1},t.usePlugin(se.default);},listeners:{"scope:add-document":function(t){return Hn(t,"add")},"scope:remove-document":function(t){return Hn(t,"remove")},"interactable:unset":function(t,e){for(var n=t.interactable,r=e.interactions.list.length-1;r>=0;r--){var o=e.interactions.list[r];o.interactable===n&&(o.stop(),e.fire("interactions:destroy",{interaction:o}),o.destroy(),e.interactions.list.length>2&&e.interactions.list.splice(r,1));}}},onDocSignal:Hn,doOnInteractions:$n,methodNames:qn};Fn.default=Kn;var Zn={};function Jn(t){return (Jn="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function Qn(t,e,n){return (Qn="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(t,e,n){var r=function(t,e){for(;!Object.prototype.hasOwnProperty.call(t,e)&&null!==(t=nr(t)););return t}(t,e);if(r){var o=Object.getOwnPropertyDescriptor(r,e);return o.get?o.get.call(n):o.value}})(t,e,n||t)}function tr(t,e){return (tr=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function er(t,e){return !e||"object"!==Jn(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function nr(t){return (nr=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function rr(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function or(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r);}}function ir(t,e,n){return e&&or(t.prototype,e),n&&or(t,n),t}function ar(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}Object.defineProperty(Zn,"__esModule",{value:!0}),Zn.initScope=lr,Zn.Scope=void 0;var sr=function(){function t(){var e=this;rr(this,t),ar(this,"id","__interact_scope_".concat(Math.floor(100*Math.random()))),ar(this,"isInitialized",!1),ar(this,"listenerMaps",[]),ar(this,"browser",b.default),ar(this,"defaults",(0, ge.default)(Me.defaults)),ar(this,"Eventable",cn.Eventable),ar(this,"actions",{map:{},phases:{start:!0,move:!0,end:!0},methodDict:{},phaselessTypes:{}}),ar(this,"interactStatic",(0, gn.createInteractStatic)(this)),ar(this,"InteractEvent",je.InteractEvent),ar(this,"Interactable",void 0),ar(this,"interactables",new wn.InteractableSet(this)),ar(this,"_win",void 0),ar(this,"document",void 0),ar(this,"window",void 0),ar(this,"documents",[]),ar(this,"_plugins",{list:[],map:{}}),ar(this,"onWindowUnload",(function(t){return e.removeDocument(t.target)}));var n=this;this.Interactable=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&tr(t,e);}(i,t);var e,r,o=(e=i,r=function(){if("undefined"==typeof Reflect||!Reflect.construct)return !1;if(Reflect.construct.sham)return !1;if("function"==typeof Proxy)return !0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return !1}}(),function(){var t,n=nr(e);if(r){var o=nr(this).constructor;t=Reflect.construct(n,arguments,o);}else t=n.apply(this,arguments);return er(this,t)});function i(){return rr(this,i),o.apply(this,arguments)}return ir(i,[{key:"_defaults",get:function(){return n.defaults}},{key:"set",value:function(t){return Qn(nr(i.prototype),"set",this).call(this,t),n.fire("interactable:set",{options:t,interactable:this}),this}},{key:"unset",value:function(){Qn(nr(i.prototype),"unset",this).call(this),n.interactables.list.splice(n.interactables.list.indexOf(this),1),n.fire("interactable:unset",{interactable:this});}}]),i}(yn.Interactable);}return ir(t,[{key:"addListeners",value:function(t,e){this.listenerMaps.push({id:e,map:t});}},{key:"fire",value:function(t,e){for(var n=0;n<this.listenerMaps.length;n++){var r=this.listenerMaps[n].map[t];if(r&&!1===r(e,this,t))return !1}}},{key:"init",value:function(t){return this.isInitialized?this:lr(this,t)}},{key:"pluginIsInstalled",value:function(t){return this._plugins.map[t.id]||-1!==this._plugins.list.indexOf(t)}},{key:"usePlugin",value:function(t,e){if(!this.isInitialized)return this;if(this.pluginIsInstalled(t))return this;if(t.id&&(this._plugins.map[t.id]=t),this._plugins.list.push(t),t.install&&t.install(this,e),t.listeners&&t.before){for(var n=0,r=this.listenerMaps.length,o=t.before.reduce((function(t,e){return t[e]=!0,t[ur(e)]=!0,t}),{});n<r;n++){var i=this.listenerMaps[n].id;if(o[i]||o[ur(i)])break}this.listenerMaps.splice(n,0,{id:t.id,map:t.listeners});}else t.listeners&&this.listenerMaps.push({id:t.id,map:t.listeners});return this}},{key:"addDocument",value:function(t,n){if(-1!==this.getDocIndex(t))return !1;var r=e.getWindow(t);n=n?(0, j.default)({},n):{},this.documents.push({doc:t,options:n}),this.events.documents.push(t),t!==this.document&&this.events.add(r,"unload",this.onWindowUnload),this.fire("scope:add-document",{doc:t,window:r,scope:this,options:n});}},{key:"removeDocument",value:function(t){var n=this.getDocIndex(t),r=e.getWindow(t),o=this.documents[n].options;this.events.remove(r,"unload",this.onWindowUnload),this.documents.splice(n,1),this.events.documents.splice(n,1),this.fire("scope:remove-document",{doc:t,window:r,scope:this,options:o});}},{key:"getDocIndex",value:function(t){for(var e=0;e<this.documents.length;e++)if(this.documents[e].doc===t)return e;return -1}},{key:"getDocOptions",value:function(t){var e=this.getDocIndex(t);return -1===e?null:this.documents[e].options}},{key:"now",value:function(){return (this.window.Date||Date).now()}}]),t}();function lr(t,n){return t.isInitialized=!0,i.default.window(n)&&e.init(n),h.default.init(n),b.default.init(n),jt.default.init(n),t.window=n,t.document=n.document,t.usePlugin(Fn.default),t.usePlugin(Sn.default),t}function ur(t){return t&&t.replace(/\/.*$/,"")}Zn.Scope=sr;var cr={};Object.defineProperty(cr,"__esModule",{value:!0}),cr.default=void 0;var fr=new Zn.Scope,dr=fr.interactStatic;cr.default=dr;var pr="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:void 0;fr.init(pr);var vr={};Object.defineProperty(vr,"__esModule",{value:!0}),vr.default=void 0,vr.default=function(){};var hr={};Object.defineProperty(hr,"__esModule",{value:!0}),hr.default=void 0,hr.default=function(){};var gr={};function yr(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t)){var n=[],r=!0,o=!1,i=void 0;try{for(var a,s=t[Symbol.iterator]();!(r=(a=s.next()).done)&&(n.push(a.value),!e||n.length!==e);r=!0);}catch(t){o=!0,i=t;}finally{try{r||null==s.return||s.return();}finally{if(o)throw i}}return n}}(t,e)||function(t,e){if(t){if("string"==typeof t)return mr(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return "Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?mr(t,e):void 0}}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function mr(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=Array(e);n<e;n++)r[n]=t[n];return r}Object.defineProperty(gr,"__esModule",{value:!0}),gr.default=void 0,gr.default=function(t){var e=[["x","y"],["left","top"],["right","bottom"],["width","height"]].filter((function(e){var n=yr(e,2),r=n[0],o=n[1];return r in t||o in t})),n=function(n,r){for(var o=t.range,i=t.limits,a=void 0===i?{left:-1/0,right:1/0,top:-1/0,bottom:1/0}:i,s=t.offset,l=void 0===s?{x:0,y:0}:s,u={range:o,grid:t,x:null,y:null},c=0;c<e.length;c++){var f=yr(e[c],2),d=f[0],p=f[1],v=Math.round((n-l.x)/t[d]),h=Math.round((r-l.y)/t[p]);u[d]=Math.max(a.left,Math.min(a.right,v*t[d]+l.x)),u[p]=Math.max(a.top,Math.min(a.bottom,h*t[p]+l.y));}return u};return n.grid=t,n.coordFields=e,n};var br={};Object.defineProperty(br,"__esModule",{value:!0}),Object.defineProperty(br,"edgeTarget",{enumerable:!0,get:function(){return vr.default}}),Object.defineProperty(br,"elements",{enumerable:!0,get:function(){return hr.default}}),Object.defineProperty(br,"grid",{enumerable:!0,get:function(){return gr.default}});var xr={};Object.defineProperty(xr,"__esModule",{value:!0}),xr.default=void 0;var wr={id:"snappers",install:function(t){var e=t.interactStatic;e.snappers=(0, j.default)(e.snappers||{},br),e.createSnapGrid=e.snappers.grid;}};xr.default=wr;var _r={};function Pr(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r);}return n}function Or(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?Pr(Object(n),!0).forEach((function(e){Sr(t,e,n[e]);})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):Pr(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e));}));}return t}function Sr(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}Object.defineProperty(_r,"__esModule",{value:!0}),_r.aspectRatio=_r.default=void 0;var Er={start:function(t){var e=t.state,n=t.rect,r=t.edges,o=t.pageCoords,i=e.options.ratio,a=e.options,s=a.equalDelta,l=a.modifiers;"preserve"===i&&(i=n.width/n.height),e.startCoords=(0, j.default)({},o),e.startRect=(0, j.default)({},n),e.ratio=i,e.equalDelta=s;var u=e.linkedEdges={top:r.top||r.left&&!r.bottom,left:r.left||r.top&&!r.right,bottom:r.bottom||r.right&&!r.top,right:r.right||r.bottom&&!r.left};if(e.xIsPrimaryAxis=!(!r.left&&!r.right),e.equalDelta)e.edgeSign=(u.left?1:-1)*(u.top?1:-1);else {var c=e.xIsPrimaryAxis?u.top:u.left;e.edgeSign=c?-1:1;}if((0, j.default)(t.edges,u),l&&l.length){var f=new ye.default(t.interaction);f.copyFrom(t.interaction.modification),f.prepareStates(l),e.subModification=f,f.startAll(Or({},t));}},set:function(t){var e=t.state,n=t.rect,r=t.coords,o=(0, j.default)({},r),i=e.equalDelta?Tr:Mr;if(i(e,e.xIsPrimaryAxis,r,n),!e.subModification)return null;var a=(0, j.default)({},n);(0, k.addEdges)(e.linkedEdges,a,{x:r.x-o.x,y:r.y-o.y});var s=e.subModification.setAll(Or(Or({},t),{},{rect:a,edges:e.linkedEdges,pageCoords:r,prevCoords:r,prevRect:a})),l=s.delta;return s.changed&&(i(e,Math.abs(l.x)>Math.abs(l.y),s.coords,s.rect),(0, j.default)(r,s.coords)),s.eventProps},defaults:{ratio:"preserve",equalDelta:!1,modifiers:[],enabled:!1}};function Tr(t,e,n){var r=t.startCoords,o=t.edgeSign;e?n.y=r.y+(n.x-r.x)*o:n.x=r.x+(n.y-r.y)*o;}function Mr(t,e,n,r){var o=t.startRect,i=t.startCoords,a=t.ratio,s=t.edgeSign;if(e){var l=r.width/a;n.y=i.y+(l-o.height)*s;}else {var u=r.height*a;n.x=i.x+(u-o.width)*s;}}_r.aspectRatio=Er;var jr=(0, Se.makeModifier)(Er,"aspectRatio");_r.default=jr;var kr={};Object.defineProperty(kr,"__esModule",{value:!0}),kr.default=void 0;var Ir=function(){};Ir._defaults={};var Dr=Ir;kr.default=Dr;var Ar={};Object.defineProperty(Ar,"__esModule",{value:!0}),Object.defineProperty(Ar,"default",{enumerable:!0,get:function(){return kr.default}});var Rr={};function zr(t,e,n){return i.default.func(t)?k.resolveRectLike(t,e.interactable,e.element,[n.x,n.y,e]):k.resolveRectLike(t,e.interactable,e.element)}Object.defineProperty(Rr,"__esModule",{value:!0}),Rr.getRestrictionRect=zr,Rr.restrict=Rr.default=void 0;var Cr={start:function(t){var e=t.rect,n=t.startOffset,r=t.state,o=t.interaction,i=t.pageCoords,a=r.options,s=a.elementRect,l=(0, j.default)({left:0,top:0,right:0,bottom:0},a.offset||{});if(e&&s){var u=zr(a.restriction,o,i);if(u){var c=u.right-u.left-e.width,f=u.bottom-u.top-e.height;c<0&&(l.left+=c,l.right+=c),f<0&&(l.top+=f,l.bottom+=f);}l.left+=n.left-e.width*s.left,l.top+=n.top-e.height*s.top,l.right+=n.right-e.width*(1-s.right),l.bottom+=n.bottom-e.height*(1-s.bottom);}r.offset=l;},set:function(t){var e=t.coords,n=t.interaction,r=t.state,o=r.options,i=r.offset,a=zr(o.restriction,n,e);if(a){var s=k.xywhToTlbr(a);e.x=Math.max(Math.min(s.right-i.right,e.x),s.left+i.left),e.y=Math.max(Math.min(s.bottom-i.bottom,e.y),s.top+i.top);}},defaults:{restriction:null,elementRect:null,offset:null,endOnly:!1,enabled:!1}};Rr.restrict=Cr;var Fr=(0, Se.makeModifier)(Cr,"restrict");Rr.default=Fr;var Xr={};Object.defineProperty(Xr,"__esModule",{value:!0}),Xr.restrictEdges=Xr.default=void 0;var Yr={top:1/0,left:1/0,bottom:-1/0,right:-1/0},Br={top:-1/0,left:-1/0,bottom:1/0,right:1/0};function Wr(t,e){for(var n=["top","left","bottom","right"],r=0;r<n.length;r++){var o=n[r];o in t||(t[o]=e[o]);}return t}var Lr={noInner:Yr,noOuter:Br,start:function(t){var e,n=t.interaction,r=t.startOffset,o=t.state,i=o.options;if(i){var a=(0, Rr.getRestrictionRect)(i.offset,n,n.coords.start.page);e=k.rectToXY(a);}e=e||{x:0,y:0},o.offset={top:e.y+r.top,left:e.x+r.left,bottom:e.y-r.bottom,right:e.x-r.right};},set:function(t){var e=t.coords,n=t.edges,r=t.interaction,o=t.state,i=o.offset,a=o.options;if(n){var s=(0, j.default)({},e),l=(0, Rr.getRestrictionRect)(a.inner,r,s)||{},u=(0, Rr.getRestrictionRect)(a.outer,r,s)||{};Wr(l,Yr),Wr(u,Br),n.top?e.y=Math.min(Math.max(u.top+i.top,s.y),l.top+i.top):n.bottom&&(e.y=Math.max(Math.min(u.bottom+i.bottom,s.y),l.bottom+i.bottom)),n.left?e.x=Math.min(Math.max(u.left+i.left,s.x),l.left+i.left):n.right&&(e.x=Math.max(Math.min(u.right+i.right,s.x),l.right+i.right));}},defaults:{inner:null,outer:null,offset:null,endOnly:!1,enabled:!1}};Xr.restrictEdges=Lr;var Ur=(0, Se.makeModifier)(Lr,"restrictEdges");Xr.default=Ur;var Vr={};Object.defineProperty(Vr,"__esModule",{value:!0}),Vr.restrictRect=Vr.default=void 0;var Nr=(0, j.default)({get elementRect(){return {top:0,left:0,bottom:1,right:1}},set elementRect(t){}},Rr.restrict.defaults),qr={start:Rr.restrict.start,set:Rr.restrict.set,defaults:Nr};Vr.restrictRect=qr;var $r=(0, Se.makeModifier)(qr,"restrictRect");Vr.default=$r;var Gr={};Object.defineProperty(Gr,"__esModule",{value:!0}),Gr.restrictSize=Gr.default=void 0;var Hr={width:-1/0,height:-1/0},Kr={width:1/0,height:1/0},Zr={start:function(t){return Xr.restrictEdges.start(t)},set:function(t){var e=t.interaction,n=t.state,r=t.rect,o=t.edges,i=n.options;if(o){var a=k.tlbrToXywh((0, Rr.getRestrictionRect)(i.min,e,t.coords))||Hr,s=k.tlbrToXywh((0, Rr.getRestrictionRect)(i.max,e,t.coords))||Kr;n.options={endOnly:i.endOnly,inner:(0, j.default)({},Xr.restrictEdges.noInner),outer:(0, j.default)({},Xr.restrictEdges.noOuter)},o.top?(n.options.inner.top=r.bottom-a.height,n.options.outer.top=r.bottom-s.height):o.bottom&&(n.options.inner.bottom=r.top+a.height,n.options.outer.bottom=r.top+s.height),o.left?(n.options.inner.left=r.right-a.width,n.options.outer.left=r.right-s.width):o.right&&(n.options.inner.right=r.left+a.width,n.options.outer.right=r.left+s.width),Xr.restrictEdges.set(t),n.options=i;}},defaults:{min:null,max:null,endOnly:!1,enabled:!1}};Gr.restrictSize=Zr;var Jr=(0, Se.makeModifier)(Zr,"restrictSize");Gr.default=Jr;var Qr={};Object.defineProperty(Qr,"__esModule",{value:!0}),Object.defineProperty(Qr,"default",{enumerable:!0,get:function(){return kr.default}});var to={};Object.defineProperty(to,"__esModule",{value:!0}),to.snap=to.default=void 0;var eo={start:function(t){var e,n=t.interaction,r=t.interactable,o=t.element,i=t.rect,a=t.state,s=t.startOffset,l=a.options,u=l.offsetWithOrigin?function(t){var e=t.interaction.element;return (0, k.rectToXY)((0, k.resolveRectLike)(t.state.options.origin,null,null,[e]))||(0, A.default)(t.interactable,e,t.interaction.prepared.name)}(t):{x:0,y:0};if("startCoords"===l.offset)e={x:n.coords.start.page.x,y:n.coords.start.page.y};else {var c=(0, k.resolveRectLike)(l.offset,r,o,[n]);(e=(0, k.rectToXY)(c)||{x:0,y:0}).x+=u.x,e.y+=u.y;}var f=l.relativePoints;a.offsets=i&&f&&f.length?f.map((function(t,n){return {index:n,relativePoint:t,x:s.left-i.width*t.x+e.x,y:s.top-i.height*t.y+e.y}})):[{index:0,relativePoint:null,x:e.x,y:e.y}];},set:function(t){var e=t.interaction,n=t.coords,r=t.state,o=r.options,a=r.offsets,s=(0, A.default)(e.interactable,e.element,e.prepared.name),l=(0, j.default)({},n),u=[];o.offsetWithOrigin||(l.x-=s.x,l.y-=s.y);for(var c=0;c<a.length;c++)for(var f=a[c],d=l.x-f.x,p=l.y-f.y,v=0,h=o.targets.length;v<h;v++){var g,y=o.targets[v];(g=i.default.func(y)?y(d,p,e._proxy,f,v):y)&&u.push({x:(i.default.number(g.x)?g.x:d)+f.x,y:(i.default.number(g.y)?g.y:p)+f.y,range:i.default.number(g.range)?g.range:o.range,source:y,index:v,offset:f});}for(var m={target:null,inRange:!1,distance:0,range:0,delta:{x:0,y:0}},b=0;b<u.length;b++){var x=u[b],w=x.range,_=x.x-l.x,P=x.y-l.y,O=(0, C.default)(_,P),S=O<=w;w===1/0&&m.inRange&&m.range!==1/0&&(S=!1),m.target&&!(S?m.inRange&&w!==1/0?O/w<m.distance/m.range:w===1/0&&m.range!==1/0||O<m.distance:!m.inRange&&O<m.distance)||(m.target=x,m.distance=O,m.range=w,m.inRange=S,m.delta.x=_,m.delta.y=P);}return m.inRange&&(n.x=m.target.x,n.y=m.target.y),r.closest=m,m},defaults:{range:1/0,targets:null,offset:null,offsetWithOrigin:!0,origin:null,relativePoints:null,endOnly:!1,enabled:!1}};to.snap=eo;var no=(0, Se.makeModifier)(eo,"snap");to.default=no;var ro={};function oo(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=Array(e);n<e;n++)r[n]=t[n];return r}Object.defineProperty(ro,"__esModule",{value:!0}),ro.snapSize=ro.default=void 0;var io={start:function(t){var e=t.state,n=t.edges,r=e.options;if(!n)return null;t.state={options:{targets:null,relativePoints:[{x:n.left?0:1,y:n.top?0:1}],offset:r.offset||"self",origin:{x:0,y:0},range:r.range}},e.targetFields=e.targetFields||[["width","height"],["x","y"]],to.snap.start(t),e.offsets=t.state.offsets,t.state=e;},set:function(t){var e,n,r=t.interaction,o=t.state,a=t.coords,s=o.options,l=o.offsets,u={x:a.x-l[0].x,y:a.y-l[0].y};o.options=(0, j.default)({},s),o.options.targets=[];for(var c=0;c<(s.targets||[]).length;c++){var f=(s.targets||[])[c],d=void 0;if(d=i.default.func(f)?f(u.x,u.y,r):f){for(var p=0;p<o.targetFields.length;p++){var v=(e=o.targetFields[p],n=2,function(t){if(Array.isArray(t))return t}(e)||function(t,e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t)){var n=[],r=!0,o=!1,i=void 0;try{for(var a,s=t[Symbol.iterator]();!(r=(a=s.next()).done)&&(n.push(a.value),!e||n.length!==e);r=!0);}catch(t){o=!0,i=t;}finally{try{r||null==s.return||s.return();}finally{if(o)throw i}}return n}}(e,n)||function(t,e){if(t){if("string"==typeof t)return oo(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return "Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?oo(t,e):void 0}}(e,n)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()),h=v[0],g=v[1];if(h in d||g in d){d.x=d[h],d.y=d[g];break}}o.options.targets.push(d);}}var y=to.snap.set(t);return o.options=s,y},defaults:{range:1/0,targets:null,offset:null,endOnly:!1,enabled:!1}};ro.snapSize=io;var ao=(0, Se.makeModifier)(io,"snapSize");ro.default=ao;var so={};Object.defineProperty(so,"__esModule",{value:!0}),so.snapEdges=so.default=void 0;var lo={start:function(t){var e=t.edges;return e?(t.state.targetFields=t.state.targetFields||[[e.left?"left":"right",e.top?"top":"bottom"]],ro.snapSize.start(t)):null},set:ro.snapSize.set,defaults:(0, j.default)((0, ge.default)(ro.snapSize.defaults),{targets:null,range:null,offset:{x:0,y:0}})};so.snapEdges=lo;var uo=(0, Se.makeModifier)(lo,"snapEdges");so.default=uo;var co={};Object.defineProperty(co,"__esModule",{value:!0}),Object.defineProperty(co,"default",{enumerable:!0,get:function(){return kr.default}});var fo={};Object.defineProperty(fo,"__esModule",{value:!0}),Object.defineProperty(fo,"default",{enumerable:!0,get:function(){return kr.default}});var po={};Object.defineProperty(po,"__esModule",{value:!0}),po.default=void 0;var vo={aspectRatio:_r.default,restrictEdges:Xr.default,restrict:Rr.default,restrictRect:Vr.default,restrictSize:Gr.default,snapEdges:so.default,snap:to.default,snapSize:ro.default,spring:co.default,avoid:Ar.default,transform:fo.default,rubberband:Qr.default};po.default=vo;var ho={};Object.defineProperty(ho,"__esModule",{value:!0}),ho.default=void 0;var go={id:"modifiers",install:function(t){var e=t.interactStatic;for(var n in t.usePlugin(Se.default),t.usePlugin(xr.default),e.modifiers=po.default,po.default){var r=po.default[n],o=r._defaults,i=r._methods;o._methods=i,t.defaults.perAction[n]=o;}}};ho.default=go;var yo={};function mo(t){return (mo="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function bo(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r);}}function xo(t,e){return (xo=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function wo(t,e){return !e||"object"!==mo(e)&&"function"!=typeof e?_o(t):e}function _o(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function Po(t){return (Po=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function Oo(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}Object.defineProperty(yo,"__esModule",{value:!0}),yo.PointerEvent=yo.default=void 0;var So=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&xo(t,e);}(a,t);var e,n,r,o,i=(r=a,o=function(){if("undefined"==typeof Reflect||!Reflect.construct)return !1;if(Reflect.construct.sham)return !1;if("function"==typeof Proxy)return !0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return !1}}(),function(){var t,e=Po(r);if(o){var n=Po(this).constructor;t=Reflect.construct(e,arguments,n);}else t=e.apply(this,arguments);return wo(this,t)});function a(t,e,n,r,o,s){var l;if(function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,a),Oo(_o(l=i.call(this,o)),"type",void 0),Oo(_o(l),"originalEvent",void 0),Oo(_o(l),"pointerId",void 0),Oo(_o(l),"pointerType",void 0),Oo(_o(l),"double",void 0),Oo(_o(l),"pageX",void 0),Oo(_o(l),"pageY",void 0),Oo(_o(l),"clientX",void 0),Oo(_o(l),"clientY",void 0),Oo(_o(l),"dt",void 0),Oo(_o(l),"eventable",void 0),B.pointerExtend(_o(l),n),n!==e&&B.pointerExtend(_o(l),e),l.timeStamp=s,l.originalEvent=n,l.type=t,l.pointerId=B.getPointerId(e),l.pointerType=B.getPointerType(e),l.target=r,l.currentTarget=null,"tap"===t){var u=o.getPointerIndex(e);l.dt=l.timeStamp-o.pointers[u].downTime;var c=l.timeStamp-o.tapTime;l.double=!!(o.prevTap&&"doubletap"!==o.prevTap.type&&o.prevTap.target===l.target&&c<500);}else "doubletap"===t&&(l.dt=e.timeStamp-o.tapTime);return l}return e=a,(n=[{key:"_subtractOrigin",value:function(t){var e=t.x,n=t.y;return this.pageX-=e,this.pageY-=n,this.clientX-=e,this.clientY-=n,this}},{key:"_addOrigin",value:function(t){var e=t.x,n=t.y;return this.pageX+=e,this.pageY+=n,this.clientX+=e,this.clientY+=n,this}},{key:"preventDefault",value:function(){this.originalEvent.preventDefault();}}])&&bo(e.prototype,n),a}($.BaseEvent);yo.PointerEvent=yo.default=So;var Eo={};Object.defineProperty(Eo,"__esModule",{value:!0}),Eo.default=void 0;var To={id:"pointer-events/base",before:["inertia","modifiers","auto-start","actions"],install:function(t){t.pointerEvents=To,t.defaults.actions.pointerEvents=To.defaults,(0, j.default)(t.actions.phaselessTypes,To.types);},listeners:{"interactions:new":function(t){var e=t.interaction;e.prevTap=null,e.tapTime=0;},"interactions:update-pointer":function(t){var e=t.down,n=t.pointerInfo;!e&&n.hold||(n.hold={duration:1/0,timeout:null});},"interactions:move":function(t,e){var n=t.interaction,r=t.pointer,o=t.event,i=t.eventTarget;t.duplicate||n.pointerIsDown&&!n.pointerWasMoved||(n.pointerIsDown&&ko(t),Mo({interaction:n,pointer:r,event:o,eventTarget:i,type:"move"},e));},"interactions:down":function(t,e){!function(t,e){for(var n=t.interaction,r=t.pointer,o=t.event,i=t.eventTarget,a=t.pointerIndex,s=n.pointers[a].hold,l=_.getPath(i),u={interaction:n,pointer:r,event:o,eventTarget:i,type:"hold",targets:[],path:l,node:null},c=0;c<l.length;c++){var f=l[c];u.node=f,e.fire("pointerEvents:collect-targets",u);}if(u.targets.length){for(var d=1/0,p=0;p<u.targets.length;p++){var v=u.targets[p].eventable.options.holdDuration;v<d&&(d=v);}s.duration=d,s.timeout=setTimeout((function(){Mo({interaction:n,eventTarget:i,pointer:r,event:o,type:"hold"},e);}),d);}}(t,e),Mo(t,e);},"interactions:up":function(t,e){ko(t),Mo(t,e),function(t,e){var n=t.interaction,r=t.pointer,o=t.event,i=t.eventTarget;n.pointerWasMoved||Mo({interaction:n,eventTarget:i,pointer:r,event:o,type:"tap"},e);}(t,e);},"interactions:cancel":function(t,e){ko(t),Mo(t,e);}},PointerEvent:yo.PointerEvent,fire:Mo,collectEventTargets:jo,defaults:{holdDuration:600,ignoreFrom:null,allowFrom:null,origin:{x:0,y:0}},types:{down:!0,move:!0,up:!0,cancel:!0,tap:!0,doubletap:!0,hold:!0}};function Mo(t,e){var n=t.interaction,r=t.pointer,o=t.event,i=t.eventTarget,a=t.type,s=t.targets,l=void 0===s?jo(t,e):s,u=new yo.PointerEvent(a,r,o,i,n,e.now());e.fire("pointerEvents:new",{pointerEvent:u});for(var c={interaction:n,pointer:r,event:o,eventTarget:i,targets:l,type:a,pointerEvent:u},f=0;f<l.length;f++){var d=l[f];for(var p in d.props||{})u[p]=d.props[p];var v=(0, A.default)(d.eventable,d.node);if(u._subtractOrigin(v),u.eventable=d.eventable,u.currentTarget=d.node,d.eventable.fire(u),u._addOrigin(v),u.immediatePropagationStopped||u.propagationStopped&&f+1<l.length&&l[f+1].node!==u.currentTarget)break}if(e.fire("pointerEvents:fired",c),"tap"===a){var h=u.double?Mo({interaction:n,pointer:r,event:o,eventTarget:i,type:"doubletap"},e):u;n.prevTap=h,n.tapTime=h.timeStamp;}return u}function jo(t,e){var n=t.interaction,r=t.pointer,o=t.event,i=t.eventTarget,a=t.type,s=n.getPointerIndex(r),l=n.pointers[s];if("tap"===a&&(n.pointerWasMoved||!l||l.downTarget!==i))return [];for(var u=_.getPath(i),c={interaction:n,pointer:r,event:o,eventTarget:i,type:a,path:u,targets:[],node:null},f=0;f<u.length;f++){var d=u[f];c.node=d,e.fire("pointerEvents:collect-targets",c);}return "hold"===a&&(c.targets=c.targets.filter((function(t){var e;return t.eventable.options.holdDuration===(null==(e=n.pointers[s])?void 0:e.hold.duration)}))),c.targets}function ko(t){var e=t.interaction,n=t.pointerIndex,r=e.pointers[n].hold;r&&r.timeout&&(clearTimeout(r.timeout),r.timeout=null);}var Io=To;Eo.default=Io;var Do={};function Ao(t){var e=t.interaction;e.holdIntervalHandle&&(clearInterval(e.holdIntervalHandle),e.holdIntervalHandle=null);}Object.defineProperty(Do,"__esModule",{value:!0}),Do.default=void 0;var Ro={id:"pointer-events/holdRepeat",install:function(t){t.usePlugin(Eo.default);var e=t.pointerEvents;e.defaults.holdRepeatInterval=0,e.types.holdrepeat=t.actions.phaselessTypes.holdrepeat=!0;},listeners:["move","up","cancel","endall"].reduce((function(t,e){return t["pointerEvents:".concat(e)]=Ao,t}),{"pointerEvents:new":function(t){var e=t.pointerEvent;"hold"===e.type&&(e.count=(e.count||0)+1);},"pointerEvents:fired":function(t,e){var n=t.interaction,r=t.pointerEvent,o=t.eventTarget,i=t.targets;if("hold"===r.type&&i.length){var a=i[0].eventable.options.holdRepeatInterval;a<=0||(n.holdIntervalHandle=setTimeout((function(){e.pointerEvents.fire({interaction:n,eventTarget:o,type:"hold",pointer:r,event:r},e);}),a));}}})};Do.default=Ro;var zo={};function Co(t){return (0, j.default)(this.events.options,t),this}Object.defineProperty(zo,"__esModule",{value:!0}),zo.default=void 0;var Fo={id:"pointer-events/interactableTargets",install:function(t){var e=t.Interactable;e.prototype.pointerEvents=Co;var n=e.prototype._backCompatOption;e.prototype._backCompatOption=function(t,e){var r=n.call(this,t,e);return r===this&&(this.events.options[t]=e),r};},listeners:{"pointerEvents:collect-targets":function(t,e){var n=t.targets,r=t.node,o=t.type,i=t.eventTarget;e.interactables.forEachMatch(r,(function(t){var e=t.events,a=e.options;e.types[o]&&e.types[o].length&&t.testIgnoreAllow(a,r,i)&&n.push({node:r,eventable:e,props:{interactable:t}});}));},"interactable:new":function(t){var e=t.interactable;e.events.getRect=function(t){return e.getRect(t)};},"interactable:set":function(t,e){var n=t.interactable,r=t.options;(0, j.default)(n.events.options,e.pointerEvents.defaults),(0, j.default)(n.events.options,r.pointerEvents||{});}}};zo.default=Fo;var Xo={};Object.defineProperty(Xo,"__esModule",{value:!0}),Xo.default=void 0;var Yo={id:"pointer-events",install:function(t){t.usePlugin(Eo),t.usePlugin(Do.default),t.usePlugin(zo.default);}};Xo.default=Yo;var Bo={};function Wo(t){var e=t.Interactable;t.actions.phases.reflow=!0,e.prototype.reflow=function(e){return function(t,e,n){for(var r=i.default.string(t.target)?Z.from(t._context.querySelectorAll(t.target)):[t.target],o=n.window.Promise,a=o?[]:null,s=function(){var i=r[l],s=t.getRect(i);if(!s)return "break";var u=Z.find(n.interactions.list,(function(n){return n.interacting()&&n.interactable===t&&n.element===i&&n.prepared.name===e.name})),c=void 0;if(u)u.move(),a&&(c=u._reflowPromise||new o((function(t){u._reflowResolve=t;})));else {var f=(0, k.tlbrToXywh)(s),d={page:{x:f.x,y:f.y},client:{x:f.x,y:f.y},timeStamp:n.now()},p=B.coordsToEvent(d);c=function(t,e,n,r,o){var i=t.interactions.new({pointerType:"reflow"}),a={interaction:i,event:o,pointer:o,eventTarget:n,phase:"reflow"};i.interactable=e,i.element=n,i.prevEvent=o,i.updatePointer(o,o,n,!0),B.setZeroCoords(i.coords.delta),(0, Yt.copyAction)(i.prepared,r),i._doPhase(a);var s=t.window.Promise,l=s?new s((function(t){i._reflowResolve=t;})):void 0;return i._reflowPromise=l,i.start(r,e,n),i._interacting?(i.move(a),i.end(o)):(i.stop(),i._reflowResolve()),i.removePointer(o,o),l}(n,t,i,e,p);}a&&a.push(c);},l=0;l<r.length&&"break"!==s();l++);return a&&o.all(a).then((function(){return t}))}(this,e,t)};}Object.defineProperty(Bo,"__esModule",{value:!0}),Bo.install=Wo,Bo.default=void 0;var Lo={id:"reflow",install:Wo,listeners:{"interactions:stop":function(t,e){var n=t.interaction;"reflow"===n.pointerType&&(n._reflowResolve&&n._reflowResolve(),Z.remove(e.interactions.list,n));}}};Bo.default=Lo;var Uo={exports:{}};function Vo(t){return (Vo="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(Uo.exports,"__esModule",{value:!0}),Uo.exports.default=void 0,cr.default.use(se.default),cr.default.use(Ge.default),cr.default.use(Xo.default),cr.default.use(en.default),cr.default.use(ho.default),cr.default.use(ie.default),cr.default.use(Tt.default),cr.default.use(Rt.default),cr.default.use(Bo.default);var No=cr.default;if(Uo.exports.default=No,"object"===Vo(Uo)&&Uo)try{Uo.exports=cr.default;}catch(t){}cr.default.default=cr.default,Uo=Uo.exports;var qo={exports:{}};function $o(t){return ($o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(qo.exports,"__esModule",{value:!0}),qo.exports.default=void 0;var Go=Uo.default;if(qo.exports.default=Go,"object"===$o(qo)&&qo)try{qo.exports=Uo.default;}catch(t){}return Uo.default.default=Uo.default,qo.exports}));

    });

    var interact = /*@__PURE__*/getDefaultExportFromCjs(interact_min);

    /* src\Merge.svelte generated by Svelte v3.46.4 */
    const file$2 = "src\\Merge.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	child_ctx[8] = i;
    	return child_ctx;
    }

    // (142:2) {#each inventory as item, itemIndex (item)}
    function create_each_block(key_1, ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t0;
    	let p;
    	let t1_value = getImageDataFromName(/*item*/ ctx[6]).name + "";
    	let t1;
    	let t2;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			t0 = space();
    			p = element("p");
    			t1 = text(t1_value);
    			t2 = space();
    			if (!src_url_equal(img.src, img_src_value = "./img/" + getImageDataFromName(/*item*/ ctx[6]).src + ".png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = getImageDataFromName(/*item*/ ctx[6]).name);
    			attr_dev(img, "class", "svelte-1x06474");
    			add_location(img, file$2, 143, 6, 4474);
    			add_location(p, file$2, 147, 6, 4609);
    			attr_dev(div, "id", "item");
    			attr_dev(div, "class", "drag-drop object svelte-1x06474");
    			add_location(div, file$2, 142, 4, 4426);
    			this.first = div;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			append_dev(div, t0);
    			append_dev(div, p);
    			append_dev(p, t1);
    			append_dev(div, t2);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*inventory*/ 1 && !src_url_equal(img.src, img_src_value = "./img/" + getImageDataFromName(/*item*/ ctx[6]).src + ".png")) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*inventory*/ 1 && img_alt_value !== (img_alt_value = getImageDataFromName(/*item*/ ctx[6]).name)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*inventory*/ 1 && t1_value !== (t1_value = getImageDataFromName(/*item*/ ctx[6]).name + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(142:2) {#each inventory as item, itemIndex (item)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let h1;
    	let t1;
    	let div0;
    	let p;
    	let b0;
    	let t3;
    	let t4_value = /*currentLevel*/ ctx[1].objective + "";
    	let t4;
    	let t5;
    	let div2;
    	let b1;
    	let t7;
    	let div1;
    	let t8;
    	let b2;
    	let br;
    	let t10;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_value = /*inventory*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*item*/ ctx[6];
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = `${/*currentLevel*/ ctx[1].name}`;
    			t1 = space();
    			div0 = element("div");
    			p = element("p");
    			b0 = element("b");
    			b0.textContent = "Objectif :";
    			t3 = space();
    			t4 = text(t4_value);
    			t5 = space();
    			div2 = element("div");
    			b1 = element("b");
    			b1.textContent = "Marmite :";
    			t7 = space();
    			div1 = element("div");
    			t8 = space();
    			b2 = element("b");
    			b2.textContent = "Inventaire :";
    			br = element("br");
    			t10 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(h1, file$2, 130, 0, 4153);
    			add_location(b0, file$2, 133, 5, 4215);
    			add_location(p, file$2, 133, 2, 4212);
    			attr_dev(div0, "class", "objective svelte-1x06474");
    			add_location(div0, file$2, 132, 0, 4185);
    			add_location(b1, file$2, 137, 2, 4282);
    			attr_dev(div1, "id", "MixingBowl");
    			attr_dev(div1, "class", "dropzone svelte-1x06474");
    			add_location(div1, file$2, 138, 2, 4302);
    			add_location(b2, file$2, 140, 2, 4348);
    			add_location(br, file$2, 140, 21, 4367);
    			attr_dev(div2, "class", "svelte-1x06474");
    			add_location(div2, file$2, 136, 0, 4273);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div0, anchor);
    			append_dev(div0, p);
    			append_dev(p, b0);
    			append_dev(p, t3);
    			append_dev(p, t4);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, b1);
    			append_dev(div2, t7);
    			append_dev(div2, div1);
    			append_dev(div2, t8);
    			append_dev(div2, b2);
    			append_dev(div2, br);
    			append_dev(div2, t10);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div2, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*getImageDataFromName, inventory*/ 1) {
    				each_value = /*inventory*/ ctx[0];
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div2, destroy_block, create_each_block, null, get_each_context);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(div2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function dragMoveListener(event) {
    	var target = event.target;

    	// keep the dragged position in the data-x/data-y attributes
    	var x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;

    	var y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

    	// translate the element
    	target.style.transform = "translate(" + x + "px, " + y + "px)";

    	// update the posiion attributes
    	target.setAttribute("data-x", x);

    	target.setAttribute("data-y", y);
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Merge', slots, []);
    	const dispatch = createEventDispatcher();
    	let currentLevel = get_store_value(level);
    	let inventory = [...currentLevel.startingItems];
    	let mixingBowl = [];

    	function resetMove() {
    		Array.from(document.getElementsByClassName("drag-drop")).forEach(element => {
    			element.style.transform = "translate(0px, 0px)";
    			element.setAttribute("data-x", "0");
    			element.setAttribute("data-y", "0");

    			if (element.classList.contains("can-drop")) {
    				// remove the drop feedback style
    				element.classList.remove("can-drop");
    			}
    		});

    		mixingBowl = [];
    	}

    	function newElem() {
    		//new elem ?
    		const mixingResult = ComputeMixing(mixingBowl, currentLevel.recipes);

    		if (mixingResult !== undefined) {
    			mixingBowl = [];
    			$$invalidate(0, inventory = new Array(...new Set([...inventory, ...mixingResult])));
    			resetMove();
    			dispatch("newItem", mixingResult);

    			// Hidden success
    			debugger;

    			if (mixingResult[0] === "Épée cassée") {
    				const newHiddenAchievement = { ...get_store_value(hiddenAchievement) };
    				newHiddenAchievement["brokenSword"] = true;
    				hiddenAchievement.set(newHiddenAchievement);
    				saveProgression();
    			}
    		}
    	}

    	// enable draggables to be dropped into this
    	interact(".dropzone").dropzone({
    		// only accept elements matching this CSS selector
    		accept: "#item",
    		// Require a 30% element overlap for a drop to be possible
    		overlap: 0.3,
    		// listen for drop related events:
    		ondropactivate(event) {
    			// add active dropzone feedback
    			event.target.classList.add("drop-active");
    		},
    		ondragenter(event) {
    			var draggableElement = event.relatedTarget;
    			var dropzoneElement = event.target;

    			// feedback the possibility of a drop
    			dropzoneElement.classList.add("drop-target");

    			draggableElement.classList.add("can-drop");
    		},
    		ondragleave(event) {
    			// remove the drop feedback style
    			event.target.classList.remove("drop-target");

    			event.relatedTarget.classList.remove("can-drop");

    			//delete object
    			let item = event.relatedTarget.textContent.slice(1, -1);

    			mixingBowl.forEach((element, i) => {
    				if (element == item) {
    					mixingBowl.splice(i, 1);
    				}
    			});

    			newElem();
    		},
    		ondrop(event) {
    			//add object
    			let item = event.relatedTarget.textContent.slice(1, -1);

    			mixingBowl = new Array(...new Set([...mixingBowl, item]));
    			newElem();
    		},
    		ondropdeactivate(event) {
    			// remove active dropzone feedback
    			event.target.classList.remove("drop-active");

    			event.target.classList.remove("drop-target");
    		}
    	});

    	interact(".drag-drop").draggable({
    		inertia: true,
    		modifiers: [interact.modifiers.restrictRect({ restriction: "parent", endOnly: true })],
    		autoScroll: true,
    		// dragMoveListener from the dragging demo above
    		listeners: { move: dragMoveListener }
    	});

    	shuffleArray(inventory);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Merge> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		ComputeMixing,
    		getImageDataFromName,
    		interact,
    		createEventDispatcher,
    		get: get_store_value,
    		level,
    		hiddenAchievement,
    		shuffleArray,
    		saveProgression,
    		dispatch,
    		currentLevel,
    		inventory,
    		mixingBowl,
    		resetMove,
    		newElem,
    		dragMoveListener
    	});

    	$$self.$inject_state = $$props => {
    		if ('currentLevel' in $$props) $$invalidate(1, currentLevel = $$props.currentLevel);
    		if ('inventory' in $$props) $$invalidate(0, inventory = $$props.inventory);
    		if ('mixingBowl' in $$props) mixingBowl = $$props.mixingBowl;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [inventory, currentLevel];
    }

    class Merge extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Merge",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    function is_date(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }

    function get_interpolator(a, b) {
        if (a === b || a !== a)
            return () => a;
        const type = typeof a;
        if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
            throw new Error('Cannot interpolate values of different type');
        }
        if (Array.isArray(a)) {
            const arr = b.map((bi, i) => {
                return get_interpolator(a[i], bi);
            });
            return t => arr.map(fn => fn(t));
        }
        if (type === 'object') {
            if (!a || !b)
                throw new Error('Object cannot be null');
            if (is_date(a) && is_date(b)) {
                a = a.getTime();
                b = b.getTime();
                const delta = b - a;
                return t => new Date(a + t * delta);
            }
            const keys = Object.keys(b);
            const interpolators = {};
            keys.forEach(key => {
                interpolators[key] = get_interpolator(a[key], b[key]);
            });
            return t => {
                const result = {};
                keys.forEach(key => {
                    result[key] = interpolators[key](t);
                });
                return result;
            };
        }
        if (type === 'number') {
            const delta = b - a;
            return t => a + t * delta;
        }
        throw new Error(`Cannot interpolate ${type} values`);
    }
    function tweened(value, defaults = {}) {
        const store = writable(value);
        let task;
        let target_value = value;
        function set(new_value, opts) {
            if (value == null) {
                store.set(value = new_value);
                return Promise.resolve();
            }
            target_value = new_value;
            let previous_task = task;
            let started = false;
            let { delay = 0, duration = 400, easing = identity, interpolate = get_interpolator } = assign(assign({}, defaults), opts);
            if (duration === 0) {
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                store.set(value = target_value);
                return Promise.resolve();
            }
            const start = now() + delay;
            let fn;
            task = loop(now => {
                if (now < start)
                    return true;
                if (!started) {
                    fn = interpolate(value, new_value);
                    if (typeof duration === 'function')
                        duration = duration(value, new_value);
                    started = true;
                }
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                const elapsed = now - start;
                if (elapsed > duration) {
                    store.set(value = new_value);
                    return false;
                }
                // @ts-ignore
                store.set(value = fn(easing(elapsed / duration)));
                return true;
            });
            return task.promise;
        }
        return {
            set,
            update: (fn, opts) => set(fn(target_value, value), opts),
            subscribe: store.subscribe
        };
    }

    /* src\ImageReveal.svelte generated by Svelte v3.46.4 */
    const file$1 = "src\\ImageReveal.svelte";

    // (49:2) {#if showImg}
    function create_if_block$2(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let div_intro;
    	let div_outro;
    	let current;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "./img/" + /*imgObject*/ ctx[0].src + ".png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*imgObject*/ ctx[0].name);
    			attr_dev(img, "class", "svelte-nu1kcg");
    			add_location(img, file$1, 50, 6, 1008);
    			attr_dev(div, "class", "item svelte-nu1kcg");
    			add_location(div, file$1, 49, 4, 964);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*imgObject*/ 1 && !src_url_equal(img.src, img_src_value = "./img/" + /*imgObject*/ ctx[0].src + ".png")) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (!current || dirty & /*imgObject*/ 1 && img_alt_value !== (img_alt_value = /*imgObject*/ ctx[0].name)) {
    				attr_dev(img, "alt", img_alt_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (div_outro) div_outro.end(1);
    				div_intro = create_in_transition(div, scale, {});
    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (div_intro) div_intro.invalidate();
    			div_outro = create_out_transition(div, fade, {});
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching && div_outro) div_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(49:2) {#if showImg}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div;
    	let current;
    	let if_block = /*showImg*/ ctx[1] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "container svelte-nu1kcg");
    			add_location(div, file$1, 47, 0, 918);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*showImg*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*showImg*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let showImg;
    	let $progress;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ImageReveal', slots, []);
    	let { imgObject } = $$props;
    	const dispatch = createEventDispatcher();
    	const progress = tweened(0, { duration: 2000, easing: identity });
    	validate_store(progress, 'progress');
    	component_subscribe($$self, progress, value => $$invalidate(3, $progress = value));
    	progress.set(1);

    	Toast.open({
    		message: `Fin débloquée`,
    		type: "warning",
    		duration: 2000,
    		position: "bottom"
    	});

    	const writable_props = ['imgObject'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ImageReveal> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('imgObject' in $$props) $$invalidate(0, imgObject = $$props.imgObject);
    	};

    	$$self.$capture_state = () => ({
    		imgObject,
    		createEventDispatcher,
    		tweened,
    		linear: identity,
    		fade,
    		scale,
    		Toast,
    		dispatch,
    		progress,
    		showImg,
    		$progress
    	});

    	$$self.$inject_state = $$props => {
    		if ('imgObject' in $$props) $$invalidate(0, imgObject = $$props.imgObject);
    		if ('showImg' in $$props) $$invalidate(1, showImg = $$props.showImg);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$progress*/ 8) {
    			$$invalidate(1, showImg = $progress > 0.1 && $progress < 0.6);
    		}

    		if ($$self.$$.dirty & /*$progress*/ 8) {
    			// const customTransition = () => {
    			//   return {
    			//     css: (t) => {
    			//       return `
    			//       transform: scale(${t});
    			//       `;
    			//     },
    			//     easing: elasticInOut,
    			//     duration: 2000,
    			//   };
    			// };
    			if ($progress == 1) {
    				dispatch("end");
    			}
    		}
    	};

    	return [imgObject, showImg, progress, $progress];
    }

    class ImageReveal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { imgObject: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ImageReveal",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*imgObject*/ ctx[0] === undefined && !('imgObject' in props)) {
    			console.warn("<ImageReveal> was created without expected prop 'imgObject'");
    		}
    	}

    	get imgObject() {
    		throw new Error("<ImageReveal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set imgObject(value) {
    		throw new Error("<ImageReveal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\GameFlow.svelte generated by Svelte v3.46.4 */

    // (43:0) {#if currentLevel.currentFlowType() === "dialog"}
    function create_if_block_2$1(ctx) {
    	let dialog;
    	let current;

    	dialog = new Dialog({
    			props: {
    				dialog: /*currentLevel*/ ctx[0].currentFlow()
    			},
    			$$inline: true
    		});

    	dialog.$on("end", /*advance*/ ctx[1]);

    	const block = {
    		c: function create() {
    			create_component(dialog.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dialog, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dialog_changes = {};
    			if (dirty & /*currentLevel*/ 1) dialog_changes.dialog = /*currentLevel*/ ctx[0].currentFlow();
    			dialog.$set(dialog_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dialog.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dialog.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dialog, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(43:0) {#if currentLevel.currentFlowType() === \\\"dialog\\\"}",
    		ctx
    	});

    	return block;
    }

    // (46:0) {#if currentLevel.currentFlowType() === "image"}
    function create_if_block_1$1(ctx) {
    	let imagereveal;
    	let current;

    	imagereveal = new ImageReveal({
    			props: {
    				imgObject: {
    					src: /*currentLevel*/ ctx[0].currentFlow().src,
    					name: /*currentLevel*/ ctx[0].currentFlow().name
    				}
    			},
    			$$inline: true
    		});

    	imagereveal.$on("end", /*advance*/ ctx[1]);

    	const block = {
    		c: function create() {
    			create_component(imagereveal.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(imagereveal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const imagereveal_changes = {};

    			if (dirty & /*currentLevel*/ 1) imagereveal_changes.imgObject = {
    				src: /*currentLevel*/ ctx[0].currentFlow().src,
    				name: /*currentLevel*/ ctx[0].currentFlow().name
    			};

    			imagereveal.$set(imagereveal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(imagereveal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(imagereveal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(imagereveal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(46:0) {#if currentLevel.currentFlowType() === \\\"image\\\"}",
    		ctx
    	});

    	return block;
    }

    // (49:0) {#if currentLevel.currentFlowType() === "game"}
    function create_if_block$1(ctx) {
    	let merge;
    	let current;
    	merge = new Merge({ $$inline: true });
    	merge.$on("newItem", /*callBackNewItem*/ ctx[2]);

    	const block = {
    		c: function create() {
    			create_component(merge.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(merge, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(merge.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(merge.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(merge, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(49:0) {#if currentLevel.currentFlowType() === \\\"game\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let show_if_2 = /*currentLevel*/ ctx[0].currentFlowType() === "dialog";
    	let t0;
    	let show_if_1 = /*currentLevel*/ ctx[0].currentFlowType() === "image";
    	let t1;
    	let show_if = /*currentLevel*/ ctx[0].currentFlowType() === "game";
    	let if_block2_anchor;
    	let current;
    	let if_block0 = show_if_2 && create_if_block_2$1(ctx);
    	let if_block1 = show_if_1 && create_if_block_1$1(ctx);
    	let if_block2 = show_if && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			if_block2_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, if_block2_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*currentLevel*/ 1) show_if_2 = /*currentLevel*/ ctx[0].currentFlowType() === "dialog";

    			if (show_if_2) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*currentLevel*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_2$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*currentLevel*/ 1) show_if_1 = /*currentLevel*/ ctx[0].currentFlowType() === "image";

    			if (show_if_1) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*currentLevel*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(t1.parentNode, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (dirty & /*currentLevel*/ 1) show_if = /*currentLevel*/ ctx[0].currentFlowType() === "game";

    			if (show_if) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty & /*currentLevel*/ 1) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block$1(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(if_block2_anchor.parentNode, if_block2_anchor);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(if_block2_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('GameFlow', slots, []);
    	let currentLevel = new Level(get_store_value(flowScene));
    	let solutionHasBeenFound = false;
    	level.set(currentLevel);

    	function advance() {
    		currentLevel.advance();

    		if (currentLevel.isComplete()) {
    			get_store_value(flowScene).transitionToLevelSelection(true);
    		} else {
    			// svelte tricks update
    			$$invalidate(0, currentLevel);
    		}
    	}

    	function callBackNewItem(event) {
    		for (let key in event.detail) {
    			const mixingItem = event.detail[key];

    			if (!solutionHasBeenFound) {
    				const isSolution = get_store_value(level).isSolutionItem(mixingItem);

    				if (isSolution) {
    					solutionHasBeenFound = true;
    					get_store_value(level).ImageToPrint(isSolution);
    					get_store_value(level).gameEndWithSolution(isSolution);
    					advance();
    				} // setTimeout(() => {
    				//   advance()
    			} // }, 2000);
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<GameFlow> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		get: get_store_value,
    		Level,
    		flowScene,
    		level,
    		Dialog,
    		Merge,
    		ImageReveal,
    		currentLevel,
    		solutionHasBeenFound,
    		advance,
    		callBackNewItem
    	});

    	$$self.$inject_state = $$props => {
    		if ('currentLevel' in $$props) $$invalidate(0, currentLevel = $$props.currentLevel);
    		if ('solutionHasBeenFound' in $$props) solutionHasBeenFound = $$props.solutionHasBeenFound;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [currentLevel, advance, callBackNewItem];
    }

    class GameFlow extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GameFlow",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.46.4 */
    const file = "src\\App.svelte";

    // (23:2) {#if $flowScene.name === "home"}
    function create_if_block_5(ctx) {
    	let homescene;
    	let current;
    	homescene = new Home({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(homescene.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(homescene, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(homescene.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(homescene.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(homescene, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(23:2) {#if $flowScene.name === \\\"home\\\"}",
    		ctx
    	});

    	return block;
    }

    // (24:2) {#if $flowScene.name === "about"}
    function create_if_block_4(ctx) {
    	let aboutscene;
    	let current;
    	aboutscene = new About({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(aboutscene.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(aboutscene, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(aboutscene.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(aboutscene.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(aboutscene, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(24:2) {#if $flowScene.name === \\\"about\\\"}",
    		ctx
    	});

    	return block;
    }

    // (25:2) {#if $flowScene.name === "levelSelection"}
    function create_if_block_3(ctx) {
    	let levelselection;
    	let current;
    	levelselection = new LevelSelection({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(levelselection.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(levelselection, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(levelselection.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(levelselection.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(levelselection, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(25:2) {#if $flowScene.name === \\\"levelSelection\\\"}",
    		ctx
    	});

    	return block;
    }

    // (26:2) {#if $flowScene.name === "achievements"}
    function create_if_block_2(ctx) {
    	let achievements;
    	let current;
    	achievements = new Achievements({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(achievements.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(achievements, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(achievements.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(achievements.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(achievements, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(26:2) {#if $flowScene.name === \\\"achievements\\\"}",
    		ctx
    	});

    	return block;
    }

    // (27:2) {#if $flowScene.name === "settings"}
    function create_if_block_1(ctx) {
    	let settings;
    	let current;
    	settings = new Settings({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(settings.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(settings, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(settings.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(settings.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(settings, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(27:2) {#if $flowScene.name === \\\"settings\\\"}",
    		ctx
    	});

    	return block;
    }

    // (28:2) {#if $flowScene.name === "gameFlow"}
    function create_if_block(ctx) {
    	let gameflow;
    	let current;
    	gameflow = new GameFlow({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(gameflow.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(gameflow, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(gameflow.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(gameflow.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(gameflow, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(28:2) {#if $flowScene.name === \\\"gameFlow\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let menu;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let t5;
    	let current;
    	menu = new Menu({ $$inline: true });
    	let if_block0 = /*$flowScene*/ ctx[0].name === "home" && create_if_block_5(ctx);
    	let if_block1 = /*$flowScene*/ ctx[0].name === "about" && create_if_block_4(ctx);
    	let if_block2 = /*$flowScene*/ ctx[0].name === "levelSelection" && create_if_block_3(ctx);
    	let if_block3 = /*$flowScene*/ ctx[0].name === "achievements" && create_if_block_2(ctx);
    	let if_block4 = /*$flowScene*/ ctx[0].name === "settings" && create_if_block_1(ctx);
    	let if_block5 = /*$flowScene*/ ctx[0].name === "gameFlow" && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(menu.$$.fragment);
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			t2 = space();
    			if (if_block2) if_block2.c();
    			t3 = space();
    			if (if_block3) if_block3.c();
    			t4 = space();
    			if (if_block4) if_block4.c();
    			t5 = space();
    			if (if_block5) if_block5.c();
    			attr_dev(main, "class", "svelte-gx469z");
    			add_location(main, file, 20, 0, 587);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(menu, main, null);
    			append_dev(main, t0);
    			if (if_block0) if_block0.m(main, null);
    			append_dev(main, t1);
    			if (if_block1) if_block1.m(main, null);
    			append_dev(main, t2);
    			if (if_block2) if_block2.m(main, null);
    			append_dev(main, t3);
    			if (if_block3) if_block3.m(main, null);
    			append_dev(main, t4);
    			if (if_block4) if_block4.m(main, null);
    			append_dev(main, t5);
    			if (if_block5) if_block5.m(main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$flowScene*/ ctx[0].name === "home") {
    				if (if_block0) {
    					if (dirty & /*$flowScene*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_5(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(main, t1);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*$flowScene*/ ctx[0].name === "about") {
    				if (if_block1) {
    					if (dirty & /*$flowScene*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_4(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(main, t2);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*$flowScene*/ ctx[0].name === "levelSelection") {
    				if (if_block2) {
    					if (dirty & /*$flowScene*/ 1) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_3(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(main, t3);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (/*$flowScene*/ ctx[0].name === "achievements") {
    				if (if_block3) {
    					if (dirty & /*$flowScene*/ 1) {
    						transition_in(if_block3, 1);
    					}
    				} else {
    					if_block3 = create_if_block_2(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(main, t4);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}

    			if (/*$flowScene*/ ctx[0].name === "settings") {
    				if (if_block4) {
    					if (dirty & /*$flowScene*/ 1) {
    						transition_in(if_block4, 1);
    					}
    				} else {
    					if_block4 = create_if_block_1(ctx);
    					if_block4.c();
    					transition_in(if_block4, 1);
    					if_block4.m(main, t5);
    				}
    			} else if (if_block4) {
    				group_outros();

    				transition_out(if_block4, 1, 1, () => {
    					if_block4 = null;
    				});

    				check_outros();
    			}

    			if (/*$flowScene*/ ctx[0].name === "gameFlow") {
    				if (if_block5) {
    					if (dirty & /*$flowScene*/ 1) {
    						transition_in(if_block5, 1);
    					}
    				} else {
    					if_block5 = create_if_block(ctx);
    					if_block5.c();
    					transition_in(if_block5, 1);
    					if_block5.m(main, null);
    				}
    			} else if (if_block5) {
    				group_outros();

    				transition_out(if_block5, 1, 1, () => {
    					if_block5 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(menu.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			transition_in(if_block3);
    			transition_in(if_block4);
    			transition_in(if_block5);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(menu.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			transition_out(if_block3);
    			transition_out(if_block4);
    			transition_out(if_block5);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(menu);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $flowScene;
    	validate_store(flowScene, 'flowScene');
    	component_subscribe($$self, flowScene, $$value => $$invalidate(0, $flowScene = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	flowScene.set(new Home$1());
    	loadProgression();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		flowScene,
    		loadProgression,
    		Home: Home$1,
    		HomeScene: Home,
    		AboutScene: About,
    		LevelSelection,
    		Achievements,
    		Settings,
    		Menu,
    		GameFlow,
    		$flowScene
    	});

    	return [$flowScene];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
      target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
